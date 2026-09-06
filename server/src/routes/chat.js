const express = require('express');
const router = express.Router();
const { db } = require('../db/database');
const { optionalToken, requireAdmin } = require('../middleware/auth');

function formatMessage(m) {
  if (!m) return null;
  return {
    ...m,
    attachments: typeof m.attachments === 'string' ? JSON.parse(m.attachments || '[]') : m.attachments,
    is_read: Boolean(m.is_read)
  };
}

// Admin: Get all chat threads
router.get('/rooms', requireAdmin, (req, res) => {
  try {
    const rooms = db.prepare(`
      SELECT r.*,
             u.avatar_url, u.email as user_email
      FROM chat_rooms r
      LEFT JOIN users u ON r.customer_id = u.id
      ORDER BY r.updated_at DESC
    `).all();

    res.json({ rooms });
  } catch (err) {
    console.error('Fetch chat rooms error:', err);
    res.status(500).json({ error: 'Failed to fetch chat rooms' });
  }
});

// Find or Create Chat Room for customer/guest
router.post('/rooms', optionalToken, (req, res) => {
  try {
    const { customer_id, guest_session_id, customer_name, customer_country, customer_company } = req.body;
    const userId = req.user ? req.user.id : customer_id;

    let room = null;

    if (userId) {
      room = db.prepare('SELECT * FROM chat_rooms WHERE customer_id = ?').get(userId);
    } else if (guest_session_id) {
      room = db.prepare('SELECT * FROM chat_rooms WHERE guest_session_id = ?').get(guest_session_id);
    }

    if (!room) {
      const roomId = 'room_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
      const name = customer_name || (req.user ? req.user.full_name : 'Export Buyer');
      const country = customer_country || (req.user ? req.user.country : 'International');
      const company = customer_company || (req.user ? req.user.company_name : '');

      db.prepare(`
        INSERT INTO chat_rooms (
          id, customer_id, guest_session_id, customer_name, customer_country,
          customer_company, last_message, last_message_at, unread_admin_count, unread_customer_count,
          created_at, updated_at
        ) VALUES (
          ?, ?, ?, ?, ?, ?, 'Chat session initiated', datetime('now'), 0, 0, datetime('now'), datetime('now')
        )
      `).run(roomId, userId || null, guest_session_id || null, name, country, company);

      // Insert welcoming system message
      const sysMsgId = 'msg_sys_' + Date.now();
      db.prepare(`
        INSERT INTO chat_messages (id, room_id, sender_type, sender_id, sender_name, message_text, attachments, is_read, created_at)
        VALUES (?, ?, 'system', 'sys_accio', 'Accio Export Support', ?, '[]', 1, datetime('now'))
      `).run(
        sysMsgId,
        roomId,
        'Ayubowan! Welcome to Accio Ceylon Dry Foods Export. An export specialist in Colombo is available live. How can we assist with your shipment, quote, or sample request?'
      );

      room = db.prepare('SELECT * FROM chat_rooms WHERE id = ?').get(roomId);
    }

    res.json({ room });
  } catch (err) {
    console.error('Find/create chat room error:', err);
    res.status(500).json({ error: 'Failed to access chat room' });
  }
});

// Get message history for a room
router.get('/history/:roomId', (req, res) => {
  try {
    const { roomId } = req.params;
    const messages = db.prepare(`
      SELECT * FROM chat_messages WHERE room_id = ? ORDER BY created_at ASC
    `).all(roomId).map(formatMessage);

    const room = db.prepare('SELECT * FROM chat_rooms WHERE id = ?').get(roomId);

    res.json({ room, messages });
  } catch (err) {
    console.error('Fetch chat history error:', err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Mark messages as read in room
router.patch('/rooms/:roomId/read', (req, res) => {
  try {
    const { roomId } = req.params;
    const { reader_type } = req.body; // 'admin' or 'customer'

    if (reader_type === 'admin') {
      db.prepare('UPDATE chat_rooms SET unread_admin_count = 0 WHERE id = ?').run(roomId);
      db.prepare("UPDATE chat_messages SET is_read = 1 WHERE room_id = ? AND sender_type = 'customer'").run(roomId);
    } else {
      db.prepare('UPDATE chat_rooms SET unread_customer_count = 0 WHERE id = ?').run(roomId);
      db.prepare("UPDATE chat_messages SET is_read = 1 WHERE room_id = ? AND sender_type = 'admin'").run(roomId);
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Mark read error:', err);
    res.status(500).json({ error: 'Failed to mark read' });
  }
});

module.exports = router;
