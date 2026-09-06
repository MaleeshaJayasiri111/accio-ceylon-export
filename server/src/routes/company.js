const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { db } = require('../db/database');
const { requireAdmin } = require('../middleware/auth');

// Ensure company_settings table exists
db.exec(`
  CREATE TABLE IF NOT EXISTS company_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    company_name TEXT DEFAULT 'Accio Ceylon (Pvt) Ltd',
    tagline TEXT DEFAULT 'Colombo''s Premier Dehydrated Tropical Fruits & Botanical Infusions Exporter',
    address TEXT DEFAULT 'Port Road, Colombo 01, Sri Lanka',
    phone TEXT DEFAULT '+94 11 258 4930',
    whatsapp TEXT DEFAULT '+94 77 123 4567',
    email TEXT DEFAULT 'export@accio-ceylon.com',
    vessel_notice TEXT DEFAULT 'MSC ANNA (FCL Departure to London Gateway & Hamburg in 48h)',
    export_target_kg REAL DEFAULT 50000,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  INSERT OR IGNORE INTO company_settings (id, company_name, tagline, address, phone, whatsapp, email, vessel_notice, export_target_kg)
  VALUES (1, 'Accio Ceylon (Pvt) Ltd', 'Colombo''s Premier Dehydrated Tropical Fruits & Botanical Infusions Exporter', 'Port Road, Colombo 01, Sri Lanka', '+94 11 258 4930', '+94 77 123 4567', 'export@accio-ceylon.com', 'MSC ANNA (FCL Departure to London Gateway & Hamburg in 48h)', 50000);
`);

// GET public company contact info
router.get('/', (req, res) => {
  try {
    const settings = db.prepare('SELECT * FROM company_settings WHERE id = 1').get();
    res.json({ settings: settings || {} });
  } catch (err) {
    console.error('Fetch company info error:', err);
    res.status(500).json({ error: 'Failed to fetch company information' });
  }
});

// UPDATE company info (Admin only)
router.put('/', requireAdmin, (req, res) => {
  try {
    const { company_name, tagline, address, phone, whatsapp, email, vessel_notice, export_target_kg } = req.body;

    db.prepare(`
      UPDATE company_settings
      SET company_name = COALESCE(?, company_name),
          tagline = COALESCE(?, tagline),
          address = COALESCE(?, address),
          phone = COALESCE(?, phone),
          whatsapp = COALESCE(?, whatsapp),
          email = COALESCE(?, email),
          vessel_notice = COALESCE(?, vessel_notice),
          export_target_kg = COALESCE(?, export_target_kg),
          updated_at = datetime('now')
      WHERE id = 1
    `).run(
      company_name || null,
      tagline || null,
      address || null,
      phone || null,
      whatsapp || null,
      email || null,
      vessel_notice || null,
      export_target_kg ? parseFloat(export_target_kg) : null
    );

    const updated = db.prepare('SELECT * FROM company_settings WHERE id = 1').get();
    res.json({ message: 'Company settings updated successfully', settings: updated });
  } catch (err) {
    console.error('Update company info error:', err);
    res.status(500).json({ error: 'Failed to update company information: ' + err.message });
  }
});

// Download SQLite Database Backup (Admin only)
router.get('/backup/sqlite', requireAdmin, (req, res) => {
  try {
    const dbFilePath = path.join(__dirname, '../db/accio.db');
    if (fs.existsSync(dbFilePath)) {
      res.setHeader('Content-Type', 'application/x-sqlite3');
      res.setHeader('Content-Disposition', `attachment; filename="accio_ceylon_backup_${Date.now()}.db"`);
      const fileStream = fs.createReadStream(dbFilePath);
      fileStream.pipe(res);
    } else {
      res.status(404).json({ error: 'Database file not found' });
    }
  } catch (err) {
    console.error('Database backup error:', err);
    res.status(500).json({ error: 'Failed to download database backup' });
  }
});

// Download JSON Export of all tables (Admin only)
router.get('/backup/json', requireAdmin, (req, res) => {
  try {
    const users = db.prepare('SELECT id, email, full_name, company_name, country, phone, role, created_at FROM users').all();
    const products = db.prepare('SELECT * FROM products').all();
    const orders = db.prepare('SELECT * FROM orders').all();
    const reviews = db.prepare('SELECT * FROM reviews').all();
    const chatRooms = db.prepare('SELECT * FROM chat_rooms').all();
    const settings = db.prepare('SELECT * FROM company_settings WHERE id = 1').get();

    const dump = {
      exportedAt: new Date().toISOString(),
      system: 'Accio Ceylon Dry Foods Export Platform',
      company: settings,
      summary: {
        totalUsers: users.length,
        totalProducts: products.length,
        totalOrders: orders.length,
        totalReviews: reviews.length,
        totalChatRooms: chatRooms.length
      },
      data: {
        users,
        products,
        orders,
        reviews,
        chatRooms
      }
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="accio_export_data_${Date.now()}.json"`);
    res.json(dump);
  } catch (err) {
    console.error('JSON backup error:', err);
    res.status(500).json({ error: 'Failed to generate JSON backup' });
  }
});

// Reset Demo Data (Admin only with confirmation)
router.post('/reset-demo', requireAdmin, (req, res) => {
  try {
    const { confirmation } = req.body;
    if (confirmation !== 'RESET_ACCIO_DEMO') {
      return res.status(400).json({ error: 'Please enter "RESET_ACCIO_DEMO" to confirm.' });
    }

    // Keep users (especially Kavindu admin) and product catalog, but clear test orders and chat logs
    db.prepare('DELETE FROM orders WHERE user_id != "usr_admin_001"').run();
    db.prepare('DELETE FROM chat_messages').run();
    db.prepare('DELETE FROM chat_rooms').run();

    res.json({ message: 'Test inquiries and chat conversations have been reset cleanly for fresh operations.' });
  } catch (err) {
    console.error('Reset demo error:', err);
    res.status(500).json({ error: 'Failed to reset demo records' });
  }
});

module.exports = router;
