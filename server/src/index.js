const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const { initDb } = require('./db/database');
const { initChatSocket } = require('./sockets/chatSocket');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const reviewRoutes = require('./routes/reviews');
const chatRoutes = require('./routes/chat');
const statsRoutes = require('./routes/stats');
const uploadRoutes = require('./routes/upload');
const companyRoutes = require('./routes/company');

// Initialize SQLite database and seed initial data
initDb();

const app = express();
const server = http.createServer(app);

// Configure Socket.io with CORS
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
  }
});

initChatSocket(io);

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Serve static assets from public/ folder
app.use('/public', express.static(path.join(__dirname, '../public')));
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));
app.use('/products', express.static(path.join(__dirname, '../public/products')));
app.use('/reviews', express.static(path.join(__dirname, '../public/uploads')));

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/company', companyRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'Accio Ceylon Dry Foods Export API & Real-Time WebSocket Engine'
  });
});

const fs = require('fs');

// Serve Admin Client at /admin if built
const adminDist = path.join(__dirname, '../../client-admin/dist');
if (fs.existsSync(adminDist)) {
  app.use('/admin', express.static(adminDist));
  app.get('/admin/*', (req, res) => {
    res.sendFile(path.join(adminDist, 'index.html'));
  });
}

// Serve Public Customer Store at / if built
const publicDist = path.join(__dirname, '../../client-public/dist');
if (fs.existsSync(publicDist)) {
  app.use(express.static(publicDist));
  app.get('*', (req, res) => {
    // Avoid intercepting API routes
    if (req.path.startsWith('/api') || req.path.startsWith('/socket.io')) {
      return res.status(404).json({ error: 'Endpoint not found' });
    }
    res.sendFile(path.join(publicDist, 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Accio Backend & Real-Time Engine running on port ${PORT}`);
});

