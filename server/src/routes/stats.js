const express = require('express');
const router = express.Router();
const { db } = require('../db/database');
const { requireAdmin } = require('../middleware/auth');

router.get('/dashboard', requireAdmin, (req, res) => {
  try {
    const totalOrders = db.prepare('SELECT COUNT(*) as count FROM orders').get().count;
    const activeOrders = db.prepare("SELECT COUNT(*) as count FROM orders WHERE status NOT IN ('Delivered', 'Cancelled')").get().count;
    const totalRevenue = db.prepare("SELECT COALESCE(SUM(total_amount), 0) as total FROM orders WHERE status NOT IN ('Cancelled')").get().total;
    const totalCustomers = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'customer'").get().count;
    const totalProducts = db.prepare('SELECT COUNT(*) as count FROM products').get().count;
    const pendingReviews = db.prepare("SELECT COUNT(*) as count FROM reviews WHERE status = 'pending'").get().count;
    const unreadChats = db.prepare('SELECT COALESCE(SUM(unread_admin_count), 0) as count FROM chat_rooms').get().count;

    // Destination country breakdown
    const countryStats = db.prepare(`
      SELECT destination_country, COUNT(*) as order_count, SUM(total_amount) as total_value
      FROM orders
      WHERE status NOT IN ('Cancelled')
      GROUP BY destination_country
      ORDER BY total_value DESC
    `).all();

    // Export volume estimation (kg from items)
    const allOrders = db.prepare('SELECT items_json FROM orders').all();
    let totalKgExported = 0;
    allOrders.forEach(o => {
      try {
        const items = JSON.parse(o.items_json || '[]');
        items.forEach(it => {
          totalKgExported += (it.quantityKg || it.qty || 0);
        });
      } catch (e) {}
    });

    // Recent orders
    const recentOrders = db.prepare(`
      SELECT id, tracking_number, customer_name, customer_company, destination_country, total_amount, currency, status, created_at
      FROM orders
      ORDER BY created_at DESC
      LIMIT 6
    `).all();

    // Top active chat threads
    const recentChats = db.prepare(`
      SELECT id, customer_name, customer_country, customer_company, last_message, last_message_at, unread_admin_count
      FROM chat_rooms
      ORDER BY updated_at DESC
      LIMIT 5
    `).all();

    res.json({
      metrics: {
        totalOrders,
        activeOrders,
        totalRevenue: Math.round(totalRevenue),
        totalKgExported: Math.round(totalKgExported),
        totalCustomers,
        totalProducts,
        pendingReviews,
        unreadChats
      },
      countryStats,
      recentOrders,
      recentChats
    });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ error: 'Failed to generate analytics' });
  }
});

module.exports = router;
