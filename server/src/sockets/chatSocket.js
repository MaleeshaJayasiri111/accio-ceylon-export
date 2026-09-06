const { db } = require('../db/database');

function initChatSocket(io) {
  io.on('connection', (socket) => {
    // Customer or Admin joins a specific room
    socket.on('join_room', ({ roomId, userType, userName }) => {
      socket.join(roomId);
      socket.data.roomId = roomId;
      socket.data.userType = userType;
      socket.data.userName = userName;

      // Broadcast user presence in room
      io.to(roomId).emit('user_status', {
        userId: socket.id,
        userName,
        userType,
        status: 'online'
      });
    });

    // Admin joins the global admin monitoring room
    socket.on('admin_join_all', () => {
      socket.join('admin_dashboard_channel');
    });

    // Sending a message
    socket.on('send_message', ({ roomId, senderType, senderId, senderName, messageText, attachments = [] }) => {
      if (!roomId || !messageText) return;

      const messageId = 'msg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
      const createdAt = new Date().toISOString().replace('T', ' ').substring(0, 19);

      try {
        // Ensure room exists in SQLite before inserting message
        const existingRoom = db.prepare('SELECT id FROM chat_rooms WHERE id = ?').get(roomId);
        if (!existingRoom) {
          db.prepare(`
            INSERT INTO chat_rooms (
              id, customer_name, customer_country, customer_company, last_message, last_message_at,
              unread_admin_count, unread_customer_count, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, 1, 0, ?, ?)
          `).run(
            roomId,
            senderName || (senderType === 'customer' ? 'Export Buyer' : 'Accio Colombo Admin'),
            'International',
            '',
            messageText,
            createdAt,
            createdAt,
            createdAt
          );
        }

        // Save to SQLite
        db.prepare(`
          INSERT INTO chat_messages (id, room_id, sender_type, sender_id, sender_name, message_text, attachments, is_read, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?)
        `).run(
          messageId,
          roomId,
          senderType,
          senderId || null,
          senderName || (senderType === 'admin' ? 'Accio Admin' : 'Customer'),
          messageText,
          JSON.stringify(attachments),
          createdAt
        );

        // Update room unread counters and last message
        if (senderType === 'customer') {
          db.prepare(`
            UPDATE chat_rooms
            SET last_message = ?, last_message_at = ?, unread_admin_count = unread_admin_count + 1, updated_at = ?
            WHERE id = ?
          `).run(messageText, createdAt, createdAt, roomId);
        } else {
          db.prepare(`
            UPDATE chat_rooms
            SET last_message = ?, last_message_at = ?, unread_customer_count = unread_customer_count + 1, updated_at = ?
            WHERE id = ?
          `).run(messageText, createdAt, createdAt, roomId);
        }

        const messagePayload = {
          id: messageId,
          room_id: roomId,
          sender_type: senderType,
          sender_id: senderId,
          sender_name: senderName,
          message_text: messageText,
          attachments,
          is_read: false,
          created_at: createdAt
        };

        // Emit to everyone in the room
        io.to(roomId).emit('receive_message', messagePayload);

        // Notify admin dashboard channel
        const updatedRoom = db.prepare('SELECT * FROM chat_rooms WHERE id = ?').get(roomId);
        io.to('admin_dashboard_channel').emit('room_updated', updatedRoom);
      } catch (err) {
        console.error('Error saving socket chat message:', err);
        socket.emit('error', { message: 'Failed to deliver message' });
      }
    });

    // Typing Indicators
    socket.on('typing_start', ({ roomId, userName, userType }) => {
      socket.to(roomId).emit('user_typing', { roomId, userName, userType, isTyping: true });
    });

    socket.on('typing_stop', ({ roomId, userName, userType }) => {
      socket.to(roomId).emit('user_typing', { roomId, userName, userType, isTyping: false });
    });

    // Mark as read
    socket.on('mark_read', ({ roomId, readerType }) => {
      try {
        if (readerType === 'admin') {
          db.prepare('UPDATE chat_rooms SET unread_admin_count = 0 WHERE id = ?').run(roomId);
          db.prepare("UPDATE chat_messages SET is_read = 1 WHERE room_id = ? AND sender_type = 'customer'").run(roomId);
        } else {
          db.prepare('UPDATE chat_rooms SET unread_customer_count = 0 WHERE id = ?').run(roomId);
          db.prepare("UPDATE chat_messages SET is_read = 1 WHERE room_id = ? AND sender_type = 'admin'").run(roomId);
        }

        io.to(roomId).emit('messages_read', { roomId, readerType });
        const updatedRoom = db.prepare('SELECT * FROM chat_rooms WHERE id = ?').get(roomId);
        io.to('admin_dashboard_channel').emit('room_updated', updatedRoom);
      } catch (err) {
        console.error('Error marking read via socket:', err);
      }
    });

    socket.on('disconnect', () => {
      if (socket.data.roomId) {
        io.to(socket.data.roomId).emit('user_status', {
          userId: socket.id,
          userName: socket.data.userName,
          userType: socket.data.userType,
          status: 'offline'
        });
      }
    });
  });
}

module.exports = {
  initChatSocket
};
