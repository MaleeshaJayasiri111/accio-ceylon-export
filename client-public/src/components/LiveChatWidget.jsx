import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Paperclip, Minimize2, Check, CheckCheck, Sparkles, Anchor } from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';

export default function LiveChatWidget() {
  const { isOpen, setIsOpen, messages, currentRoom, unreadCount, isTyping, isConnected, sendMessage, handleStartTyping } = useChat();
  const { user } = useAuth();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isTyping]);

  const handleSend = (e) => {
    e?.preventDefault();
    if (!inputText.trim()) return;
    sendMessage(inputText);
    setInputText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickPrompts = [
    'Request 2026 FOB Price List (USD/EUR)',
    'What is the MOQ for Dehydrated Mango?',
    'Private Label (White Pouch) options?',
    'Shipment lead time to Europe / UK?'
  ];

  const handlePromptClick = (prompt) => {
    sendMessage(prompt);
  };

  return (
    <div style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 400 }}>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="btn-primary"
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 25px rgba(217, 119, 6, 0.45)',
            position: 'relative'
          }}
          title="Chat with Colombo Export Team"
        >
          <MessageSquare size={26} color="#FFFFFF" />
          {unreadCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: '#EF4444',
                color: '#FFFFFF',
                borderRadius: '50%',
                width: '22px',
                height: '22px',
                fontSize: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
              }}
            >
              {unreadCount}
            </span>
          )}
          <span
            style={{
              position: 'absolute',
              bottom: '2px',
              right: '2px',
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: isConnected ? '#10B981' : '#F59E0B',
              border: '2px solid #FFFFFF'
            }}
          />
        </button>
      )}

      {/* Expanded Live Chat Dialog */}
      {isOpen && (
        <div
          className="glass-panel"
          style={{
            width: '380px',
            maxWidth: 'calc(100vw - 2rem)',
            height: '560px',
            maxHeight: 'calc(100vh - 4rem)',
            borderRadius: 'var(--radius-lg)',
            background: 'var(--bg-surface)',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 15px 40px rgba(0,0,0,0.25)',
            border: '1px solid var(--border-subtle)',
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <div
            style={{
              background: 'linear-gradient(135deg, var(--botanical-dark) 0%, var(--primary) 100%)',
              color: '#FFFFFF',
              padding: '1rem 1.2rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ position: 'relative' }}>
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"
                  alt="Export Specialist"
                  style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #FFFFFF' }}
                />
                <span
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: '11px',
                    height: '11px',
                    borderRadius: '50%',
                    background: '#10B981',
                    border: '2px solid #FFFFFF'
                  }}
                />
              </div>
              <div>
                <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.2 }}>Accio Export Desk</h4>
                <p style={{ fontSize: '0.75rem', opacity: 0.9, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Anchor size={11} /> Colombo Port HQ • Live Now
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              style={{ color: '#FFFFFF', padding: '0.35rem', borderRadius: '50%', background: 'rgba(255,255,255,0.15)' }}
            >
              <Minimize2 size={16} />
            </button>
          </div>

          {/* Messages Area */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem',
              background: 'var(--bg-surface-elevated)'
            }}
          >
            {/* Quick Inquiry Pills if short conversation */}
            {messages.length <= 2 && (
              <div style={{ marginBottom: '0.5rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Sparkles size={12} color="var(--primary)" /> Quick Export Inquiries:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {quickPrompts.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => handlePromptClick(p)}
                      style={{
                        textAlign: 'left',
                        padding: '0.45rem 0.65rem',
                        fontSize: '0.78rem',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--text-primary)',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Render Messages */}
            {messages.map((m) => {
              const isCustomer = m.sender_type === 'customer';
              const isSystem = m.sender_type === 'system';

              if (isSystem) {
                return (
                  <div
                    key={m.id}
                    style={{
                      background: 'rgba(217, 119, 6, 0.1)',
                      border: '1px solid rgba(217, 119, 6, 0.25)',
                      padding: '0.6rem 0.8rem',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.78rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.4,
                      textAlign: 'center'
                    }}
                  >
                    {m.message_text}
                  </div>
                );
              }

              return (
                <div
                  key={m.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isCustomer ? 'flex-end' : 'flex-start',
                    maxWidth: '85%',
                    alignSelf: isCustomer ? 'flex-end' : 'flex-start'
                  }}
                >
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.2rem', padding: '0 0.3rem' }}>
                    {isCustomer ? 'You' : (m.sender_name || 'Accio Admin')}
                  </div>
                  <div
                    style={{
                      padding: '0.65rem 0.95rem',
                      borderRadius: isCustomer ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                      background: isCustomer
                        ? 'linear-gradient(135deg, var(--primary) 0%, var(--accent-gold) 100%)'
                        : 'var(--bg-surface)',
                      color: isCustomer ? '#FFFFFF' : 'var(--text-primary)',
                      border: isCustomer ? 'none' : '1px solid var(--border-subtle)',
                      boxShadow: 'var(--shadow-sm)',
                      fontSize: '0.88rem',
                      lineHeight: 1.4,
                      wordBreak: 'break-word'
                    }}
                  >
                    {m.message_text}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <span>{m.created_at ? new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'}</span>
                    {isCustomer && <CheckCheck size={12} color="#10B981" />}
                  </div>
                </div>
              );
            })}

            {/* Live Typing Indicator */}
            {isTyping && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                <span className="pulse-anim" style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)' }} />
                <span>Accio Export Specialist is typing...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Message Input Box */}
          <form
            onSubmit={handleSend}
            style={{
              padding: '0.75rem 1rem',
              borderTop: '1px solid var(--border-subtle)',
              background: 'var(--bg-surface)',
              display: 'flex',
              gap: '0.5rem',
              alignItems: 'center'
            }}
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                handleStartTyping();
              }}
              onKeyDown={handleKeyDown}
              placeholder="Ask export questions or request FOB rates..."
              style={{
                flex: 1,
                padding: '0.65rem 0.9rem',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-surface-elevated)',
                color: 'var(--text-primary)',
                outline: 'none',
                fontSize: '0.88rem'
              }}
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: inputText.trim() ? 'var(--primary)' : 'var(--border-subtle)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: inputText.trim() ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s'
              }}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
