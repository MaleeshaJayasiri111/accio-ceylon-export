const express = require('express');
const router = express.Router();
const { db } = require('../db/database');
const { authenticateToken, optionalToken, requireAdmin } = require('../middleware/auth');

function formatOrder(o) {
  if (!o) return null;
  return {
    ...o,
    items_json: typeof o.items_json === 'string' ? JSON.parse(o.items_json || '[]') : o.items_json,
    items: typeof o.items_json === 'string' ? JSON.parse(o.items_json || '[]') : o.items_json
  };
}

// Track order by tracking number (Public)
router.get('/track/:trackingNumber', (req, res) => {
  try {
    const { trackingNumber } = req.params;
    const order = db.prepare(`
      SELECT * FROM orders WHERE tracking_number = ? OR id = ?
    `).get(trackingNumber.trim(), trackingNumber.trim());

    if (!order) {
      return res.status(404).json({ error: 'Order not found with provided tracking reference.' });
    }

    res.json({ order: formatOrder(order) });
  } catch (err) {
    console.error('Track order error:', err);
    res.status(500).json({ error: 'Failed to retrieve order tracking' });
  }
});

// Create Order / Quote Request
router.post('/', optionalToken, (req, res) => {
  try {
    const customer_name = req.body.customer_name || req.body.customerName;
    const customer_email = req.body.customer_email || req.body.customerEmail;
    const customer_company = req.body.customer_company || req.body.customerCompany || '';
    const customer_phone = req.body.customer_phone || req.body.customerPhone || '';
    const destination_country = req.body.destination_country || req.body.destinationCountry;
    const destination_port = req.body.destination_port || req.body.destinationPort || 'Port of Destination';
    const order_type = req.body.order_type || req.body.orderType || 'wholesale_fob';
    const total_amount = req.body.total_amount || req.body.totalAmount || 0;
    const currency = req.body.currency || 'USD';
    const shipping_method = req.body.shipping_method || req.body.shippingMethod || 'Ocean Freight (FCL/LCL)';
    const items = req.body.items || [];
    const incoterms = req.body.incoterms || 'FOB Colombo';
    const notes = req.body.notes || '';

    if (!customer_name || !customer_email || !destination_country || !items || !items.length) {
      return res.status(400).json({ error: 'Customer name, email, destination country, and items are required.' });
    }

    const orderId = 'ord_' + Date.now();
    const prefix = order_type === 'sample' ? 'ACC-SMP-2026-' : 'ACC-EXP-2026-';
    const trackingNumber = prefix + Math.floor(1000 + Math.random() * 9000);
    const userId = req.user ? req.user.id : null;

    db.prepare(`
      INSERT INTO orders (
        id, tracking_number, user_id, customer_name, customer_email, customer_company,
        customer_phone, destination_country, destination_port, order_type, total_amount,
        currency, status, shipping_method, items_json, incoterms, notes, created_at, updated_at
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now')
      )
    `).run(
      orderId,
      trackingNumber,
      userId,
      customer_name,
      customer_email,
      customer_company,
      customer_phone,
      destination_country,
      destination_port,
      order_type,
      parseFloat(total_amount || 0),
      currency,
      'Inquiry',
      shipping_method,
      JSON.stringify(items),
      incoterms,
      notes
    );

    const created = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
    res.status(201).json({
      message: 'Export order inquiry submitted successfully',
      trackingNumber,
      order: formatOrder(created)
    });
  } catch (err) {
    console.error('Create order error:', err);
    res.status(500).json({ error: 'Failed to create export order: ' + err.message });
  }
});

// Get orders list (Customer gets theirs, Admin gets all)
router.get('/', authenticateToken, (req, res) => {
  try {
    const { status, search, limit = 50 } = req.query;
    let query = 'SELECT * FROM orders WHERE 1=1';
    const params = [];

    if (req.user.role !== 'admin') {
      query += ' AND (user_id = ? OR customer_email = ?)';
      params.push(req.user.id, req.user.email);
    }

    if (status && status !== 'All') {
      query += ' AND status = ?';
      params.push(status);
    }

    if (search) {
      query += ' AND (tracking_number LIKE ? OR customer_name LIKE ? OR customer_company LIKE ? OR destination_country LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY created_at DESC LIMIT ?';
    params.push(parseInt(limit));

    const orders = db.prepare(query).all(...params).map(formatOrder);
    res.json({ orders });
  } catch (err) {
    console.error('Fetch orders error:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get single order by ID
router.get('/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (req.user.role !== 'admin' && order.user_id !== req.user.id && order.customer_email !== req.user.email) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ order: formatOrder(order) });
  } catch (err) {
    console.error('Fetch single order error:', err);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Admin: Update order status & tracking notes
router.patch('/:id/status', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes, shipping_method, destination_port } = req.body;

    const existing = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Order not found' });
    }

    db.prepare(`
      UPDATE orders SET
        status = COALESCE(?, status),
        notes = COALESCE(?, notes),
        shipping_method = COALESCE(?, shipping_method),
        destination_port = COALESCE(?, destination_port),
        updated_at = datetime('now')
      WHERE id = ?
    `).run(status, notes, shipping_method, destination_port, id);

    const updated = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
    res.json({ order: formatOrder(updated) });
  } catch (err) {
    console.error('Update order status error:', err);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

module.exports = router;
