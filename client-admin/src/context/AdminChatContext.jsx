import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAdminAuth } from './AdminAuthContext';
import { playAdminChime } from '../utils/audio';

const AdminChatContext = createContext(null);

export function AdminChatProvider({ children }) {
  const { adminUser, token } = useAdminAuth();
  const [rooms, setRooms] = useState([]);
  const [activeRoomId, setActiveRoomId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isCustomerTyping, setIsCustomerTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const socketRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Fetch all rooms
  const fetchRooms = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/chat/rooms', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.rooms) {
        setRooms(data.rooms);
        if (!activeRoomId && data.rooms.length > 0) {
          setActiveRoomId(data.rooms[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to load admin chat rooms:', err);
    }
  };

  // Socket setup
  useEffect(() => {
    if (!adminUser) return;

    const socket = io('/', {
      transports: ['websocket', 'polling']
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      socket.emit('admin_join_all');
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('room_updated', (updatedRoom) => {
      setRooms((prev) => {
        const idx = prev.findIndex((r) => r.id === updatedRoom.id);
        if (idx > -1) {
          const updated = [...prev];
          updated[idx] = { ...updated[idx], ...updatedRoom };
          return updated.sort((a, b) => new Date(b.updated_at || 0) - new Date(a.updated_at || 0));
        } else {
          return [updatedRoom, ...prev];
        }
      });
    });

    socket.on('receive_message', (msg) => {
      if (msg.sender_type === 'customer') {
        playAdminChime();
      }

      setMessages((prev) => {
        if (prev.length > 0 && prev[0].room_id === msg.room_id) {
          return [...prev, msg];
        }
        return prev;
      });
    });

    socket.on('user_typing', ({ roomId, userType, isTyping }) => {
      if (userType === 'customer' && roomId === activeRoomId) {
        setIsCustomerTyping(isTyping);
      }
    });

    fetchRooms();

    return () => {
      socket.disconnect();
    };
  }, [adminUser, token]);

  // Load message history when active room changes
  useEffect(() => {
    if (!activeRoomId) return;

    const loadHistory = async () => {
      try {
        const res = await fetch(`/api/chat/history/${activeRoomId}`);
        const data = await res.json();
        if (data.messages) {
          setMessages(data.messages);
        }

        if (socketRef.current) {
          socketRef.current.emit('join_room', {
            roomId: activeRoomId,
            userType: 'admin',
            userName: adminUser ? adminUser.full_name : 'Accio Export Admin'
          });

          socketRef.current.emit('mark_read', {
            roomId: activeRoomId,
            readerType: 'admin'
          });
        }

        // Reset unread count locally
        setRooms((prev) =>
          prev.map((r) => (r.id === activeRoomId ? { ...r, unread_admin_count: 0 } : r))
        );
      } catch (err) {
        console.error('Failed to load room messages:', err);
      }
    };

    loadHistory();
  }, [activeRoomId]);

  const sendAdminMessage = (text, attachments = []) => {
    if (!text.trim() || !activeRoomId || !socketRef.current) return;

    socketRef.current.emit('send_message', {
      roomId: activeRoomId,
      senderType: 'admin',
      senderId: adminUser ? adminUser.id : 'admin_colombo',
      senderName: adminUser ? `${adminUser.full_name} (Accio Export)` : 'Accio Export Admin',
      messageText: text.trim(),
      attachments
    });

    handleStopTyping();
  };

  const handleStartTyping = () => {
    if (!activeRoomId || !socketRef.current) return;
    socketRef.current.emit('typing_start', {
      roomId: activeRoomId,
      userName: adminUser ? adminUser.full_name : 'Accio Admin',
      userType: 'admin'
    });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(handleStopTyping, 2500);
  };

  const handleStopTyping = () => {
    if (!activeRoomId || !socketRef.current) return;
    socketRef.current.emit('typing_stop', {
      roomId: activeRoomId,
      userName: adminUser ? adminUser.full_name : 'Accio Admin',
      userType: 'admin'
    });
  };

  const totalUnreadChats = rooms.reduce((sum, r) => sum + (r.unread_admin_count || 0), 0);

  return (
    <AdminChatContext.Provider
      value={{
        rooms,
        activeRoomId,
        setActiveRoomId,
        messages,
        isCustomerTyping,
        isConnected,
        totalUnreadChats,
        sendAdminMessage,
        handleStartTyping,
        handleStopTyping,
        refreshRooms: fetchRooms
      }}
    >
      {children}
    </AdminChatContext.Provider>
  );
}

export const useAdminChat = () => useContext(AdminChatContext);
