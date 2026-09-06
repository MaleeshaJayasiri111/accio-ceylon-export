const http = require('http');
const { io } = require('../client-public/node_modules/socket.io-client');

async function runTests() {
  console.log('🧪 Starting Full System Automated Verification...\n');
  let passed = 0;
  let failed = 0;

  const assert = (name, condition, details = '') => {
    if (condition) {
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${name} - ${details}`);
      failed++;
    }
  };

  const get = (url, headers = {}) => {
    return new Promise((resolve, reject) => {
      const parsedUrl = new URL(url);
      const req = http.request({
        hostname: parsedUrl.hostname,
        port: parsedUrl.port,
        path: parsedUrl.pathname + parsedUrl.search,
        method: 'GET',
        headers
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(data), headers: res.headers });
          } catch (e) {
            resolve({ status: res.statusCode, raw: data, headers: res.headers });
          }
        });
      });
      req.on('error', reject);
      req.end();
    });
  };

  const post = (url, body, headers = {}) => {
    return new Promise((resolve, reject) => {
      const parsedUrl = new URL(url);
      const payload = JSON.stringify(body);
      const req = http.request({
        hostname: parsedUrl.hostname,
        port: parsedUrl.port,
        path: parsedUrl.pathname + parsedUrl.search,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
          ...headers
        }
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(data), headers: res.headers });
          } catch (e) {
            resolve({ status: res.statusCode, raw: data, headers: res.headers });
          }
        });
      });
      req.on('error', reject);
      req.write(payload);
      req.end();
    });
  };

  try {
    // 1. Check Frontend Servers HTTP
    console.log('--- 1. Frontend & Static Server Checks ---');
    const pubRes = await get('http://localhost:3000');
    assert('Public Store (Port 3000) is accessible', pubRes.status === 200);

    const adminRes = await get('http://localhost:3001');
    assert('Admin Portal (Port 3001) is accessible', adminRes.status === 200);

    // 2. Health Endpoint
    console.log('\n--- 2. API Backend & Database Checks ---');
    const health = await get('http://localhost:5000/api/health');
    assert('Backend Health Check', health.status === 200 && health.data.status === 'online');

    // 3. Products Endpoint
    const productsRes = await get('http://localhost:5000/api/products');
    assert('Products List API', productsRes.status === 200 && productsRes.data.products.length >= 5);
    const mango = productsRes.data.products.find(p => p.slug.includes('mango'));
    assert('Mango product has authentic images and specs', mango && mango.images.length > 0 && mango.moisture_level === '< 10%');

    // 4. Reviews Endpoint
    const reviewsRes = await get('http://localhost:5000/api/reviews');
    const reviewWithPhoto = reviewsRes.data.reviews.find(r => r.photo_urls && r.photo_urls.length > 0);
    assert('Reviews include authentic buyer packaging photos', !!reviewWithPhoto && reviewWithPhoto.photo_urls.length > 0);

    // 5. Authentication
    console.log('\n--- 3. Authentication & Authorization Checks ---');
    const adminLogin = await post('http://localhost:5000/api/auth/login', {
      email: 'admin@accio-ceylon.com',
      password: 'Admin@Accio2026'
    });
    assert('Admin Login successful', adminLogin.status === 200 && !!adminLogin.data.token && adminLogin.data.user.role === 'admin');
    const adminToken = adminLogin.data.token;

    const custLogin = await post('http://localhost:5000/api/auth/login', {
      email: 'oliver.wright@londonorganics.co.uk',
      password: 'Password123'
    });
    assert('Customer Login successful', custLogin.status === 200 && custLogin.data.user.role === 'customer');

    // 6. Orders & Tracking
    console.log('\n--- 4. Export Orders & Port Logistics Tracking ---');
    const trackRes = await get('http://localhost:5000/api/orders/track/ACC-EXP-2026-7841');
    assert('Order Tracking by ID (ACC-EXP-2026-7841)', trackRes.status === 200 && trackRes.data.order.destination_country === 'United Kingdom');

    // Create a new wholesale inquiry order
    const newOrder = await post('http://localhost:5000/api/orders', {
      customerName: 'Hans Zimmer',
      customerEmail: 'zimmer@berlindryfoods.de',
      customerCompany: 'Berlin Organic Importers',
      customerPhone: '+49 30 987654',
      destinationCountry: 'Germany',
      destinationPort: 'Hamburg Port',
      orderType: 'wholesale_fob',
      items: [
        { productId: 'prod_mango_01', productName: 'Ceylon Mango Slices', quantityKg: 1000, packType: 'Bulk 10kg Carton', unitPrice: 12.80, lineTotal: 12800 }
      ],
      totalAmount: 12800,
      currency: 'USD',
      notes: 'Please quote 20ft container CIF Hamburg'
    });
    assert('Create Export Quote Request', newOrder.status === 201 && !!newOrder.data.trackingNumber);

    // 7. Admin Dashboard Analytics
    console.log('\n--- 5. Admin Dashboard Analytics ---');
    const statsRes = await get('http://localhost:5000/api/stats/dashboard', {
      Authorization: `Bearer ${adminToken}`
    });
    assert('Admin Analytics KPI Endpoint', statsRes.status === 200 && statsRes.data.metrics.totalKgExported > 0);

    // 8. Real-Time Socket.io Live Chat
    console.log('\n--- 6. Real-Time Socket.io Live Chat Test ---');
    await new Promise((resolve) => {
      const customerSocket = io('http://localhost:5000', { transports: ['websocket'] });
      const adminSocket = io('http://localhost:5000', { transports: ['websocket'] });

      let customerJoined = false;
      let adminJoined = false;
      let messageReceivedByAdmin = false;
      let replyReceivedByCustomer = false;

      const testRoomId = 'chat_room_test_' + Date.now();

      customerSocket.on('connect', () => {
        customerSocket.emit('join_room', {
          roomId: testRoomId,
          userType: 'customer',
          userName: 'Hans Zimmer (Berlin)'
        });
        customerJoined = true;
      });

      adminSocket.on('connect', () => {
        adminSocket.emit('admin_join_all');
        adminSocket.emit('join_room', {
          roomId: testRoomId,
          userType: 'admin',
          userName: 'Dinuka Senanayake (Accio HQ)'
        });
        adminJoined = true;
      });

      adminSocket.on('receive_message', (msg) => {
        if (msg.room_id === testRoomId && msg.sender_type === 'customer') {
          messageReceivedByAdmin = true;
          // Send admin reply
          adminSocket.emit('send_message', {
            roomId: testRoomId,
            senderType: 'admin',
            senderId: 'usr_admin_001',
            senderName: 'Dinuka Senanayake (Accio HQ)',
            messageText: 'Guten Tag Hans! Our 2026 FOB Colombo price list is ready for Hamburg.',
            attachments: []
          });
        }
      });

      customerSocket.on('receive_message', (msg) => {
        if (msg.room_id === testRoomId && msg.sender_type === 'admin') {
          replyReceivedByCustomer = true;
          assert('Real-time message delivered from Customer to Admin', messageReceivedByAdmin);
          assert('Real-time reply delivered from Admin to Customer', replyReceivedByCustomer);
          customerSocket.disconnect();
          adminSocket.disconnect();
          resolve();
        }
      });

      setTimeout(() => {
        if (customerJoined && adminJoined) {
          customerSocket.emit('send_message', {
            roomId: testRoomId,
            senderType: 'customer',
            senderId: 'guest_sess_test_123',
            senderName: 'Hans Zimmer (Berlin)',
            messageText: 'Hello Accio Colombo, we need 1000kg Ceylon mango FOB quotes.',
            attachments: []
          });
        }
      }, 300);

      setTimeout(() => {
        if (!replyReceivedByCustomer) {
          assert('Real-time Socket Chat Completed within timeout', false, 'Timed out waiting for socket messages');
          customerSocket.disconnect();
          adminSocket.disconnect();
          resolve();
        }
      }, 4000);
    });

    console.log(`\n========================================`);
    console.log(`Verification Summary: ${passed} PASSED, ${failed} FAILED`);
    console.log(`========================================\n`);

  } catch (err) {
    console.error('Test execution error:', err);
  }
}

runTests();
