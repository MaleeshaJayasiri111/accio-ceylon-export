import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { playNotificationChime } from '../utils/audio';

const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const socketRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Initialize or fetch Guest Session ID
  const getGuestId = () => {
    let gid = localStorage.getItem('accio_guest_chat_id');
    if (!gid) {
      gid = 'guest_' + Math.random().toString(36).substring(2, 9);
      localStorage.setItem('accio_guest_chat_id', gid);
    }
    return gid;
  };

  // Connect socket
  useEffect(() => {
    const socket = io('/', {
      transports: ['websocket', 'polling']
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('receive_message', (msg) => {
      setMessages((prev) => [...prev, msg]);
      if (msg.sender_type === 'admin') {
        playNotificationChime();
        if (!isOpen) {
          setUnreadCount((prev) => prev + 1);
        }
      }
    });

    socket.on('user_typing', ({ userType, isTyping }) => {
      if (userType === 'admin') {
        setIsTyping(isTyping);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [isOpen]);

  // Join or create room when user state is ready
  useEffect(() => {
    const initRoom = async () => {
      const guestId = getGuestId();
      try {
        const res = await fetch('/api/chat/rooms', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(user ? { Authorization: `Bearer ${localStorage.getItem('accio_customer_token')}` } : {})
          },
          body: JSON.stringify({
            customer_id: user ? user.id : null,
            guest_session_id: user ? null : guestId,
            customer_name: user ? user.full_name : 'Guest Buyer',
            customer_country: user ? user.country : 'International',
            customer_company: user ? user.company_name : ''
          })
        });

        const data = await res.json();
        if (data.room) {
          setCurrentRoom(data.room);

          // Fetch message history
          const historyRes = await fetch(`/api/chat/history/${data.room.id}`);
          const historyData = await historyRes.json();
          if (historyData.messages) {
            setMessages(historyData.messages);
          }

          // Join socket room
          if (socketRef.current) {
            socketRef.current.emit('join_room', {
              roomId: data.room.id,
              userType: 'customer',
              userName: user ? user.full_name : 'Guest Buyer'
            });
          }
        }
      } catch (err) {
        console.error('Failed to initialize customer chat room:', err);
      }
    };

    initRoom();
  }, [user]);

  // When opening widget, mark messages as read
  useEffect(() => {
    if (isOpen && currentRoom) {
      setUnreadCount(0);
      if (socketRef.current) {
        socketRef.current.emit('mark_read', {
          roomId: currentRoom.id,
          readerType: 'customer'
        });
      }
      fetch(`/api/chat/rooms/${currentRoom.id}/read`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reader_type: 'customer' })
      }).catch(() => {});
    }
  }, [isOpen, currentRoom]);

  const sendMessage = (text, attachments = []) => {
    if (!text.trim() || !currentRoom || !socketRef.current) return;

    socketRef.current.emit('send_message', {
      roomId: currentRoom.id,
      senderType: 'customer',
      senderId: user ? user.id : getGuestId(),
      senderName: user ? user.full_name : 'Guest Buyer',
      messageText: text.trim(),
      attachments
    });

    handleStopTyping();
  };

  const handleStartTyping = () => {
    if (!currentRoom || !socketRef.current) return;
    socketRef.current.emit('typing_start', {
      roomId: currentRoom.id,
      userName: user ? user.full_name : 'Guest Buyer',
      userType: 'customer'
    });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(handleStopTyping, 2500);
  };

  const handleStopTyping = () => {
    if (!currentRoom || !socketRef.current) return;
    socketRef.current.emit('typing_stop', {
      roomId: currentRoom.id,
      userName: user ? user.full_name : 'Guest Buyer',
      userType: 'customer'
    });
  };

  return (
    <ChatContext.Provider value={{
      isOpen,
      setIsOpen,
      messages,
      currentRoom,
      unreadCount,
      isTyping,
      isConnected,
      sendMessage,
      handleStartTyping,
      handleStopTyping
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => useContext(ChatContext);
