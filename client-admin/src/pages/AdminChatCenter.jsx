import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare, Send, Search, User, Globe, Building,
  Check, CheckCheck, Sparkles, Anchor, RefreshCw, Paperclip
} from 'lucide-react';
import { useAdminChat } from '../context/AdminChatContext';

export default function AdminChatCenter() {
  const {
    rooms,
    activeRoomId,
    setActiveRoomId,
    messages,
    isCustomerTyping,
    isConnected,
    sendAdminMessage,
    handleStartTyping,
    refreshRooms
  } = useAdminChat();

  const [inputText, setInputText] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const messagesEndRef = useRef(null);

  const activeRoom = rooms.find((r) => r.id === activeRoomId) || rooms[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isCustomerTyping]);

  const handleSend = (e) => {
    e?.preventDefault();
    if (!inputText.trim()) return;
    sendAdminMessage(inputText);
    setInputText('');
  };

  const cannedReplies = [
    'Ayubowan! We have attached our official 2026 FOB Colombo Price List.',
    'Our Minimum Order Quantity (MOQ) for dehydrated mango is 25kg bulk or 1 master carton (24 retail pouches).',
    'Air Freight via Colombo BIA takes 4-7 business days with DHL/Qatar Cargo.',
    'All export consignments include Sri Lanka Department of Agriculture Phytosanitary Certificate & ISO 22000 COA.',
    'We offer custom OEM white label pouch packaging with your private barcode and branding.'
  ];

  const filteredRooms = rooms.filter((r) => {
    if (!searchFilter) return true;
    const term = searchFilter.toLowerCase();
    return (
      (r.customer_name && r.customer_name.toLowerCase().includes(term)) ||
      (r.customer_company && r.customer_company.toLowerCase().includes(term)) ||
      (r.customer_country && r.customer_country.toLowerCase().includes(term))
    );
  });

  return (
    <div
      className="glass-card"
      style={{
        height: 'calc(100vh - 128px)',
        display: 'grid',
        gridTemplateColumns: '320px 1fr 280px',
        overflow: 'hidden',
        borderRadius: 'var(--radius-lg)'
      }}
    >
      {/* 1. Left Column: Threads List */}
      <div style={{ borderRight: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', background: 'var(--bg-surface)' }}>
        {/* Search & Refresh */}
        <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={15} style={{ position: 'absolute', left: '0.65rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search buyers..."
              style={{ width: '100%', padding: '0.45rem 0.6rem 0.45rem 2rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface-elevated)', color: 'var(--text-primary)', fontSize: '0.82rem' }}
            />
          </div>
          <button
            onClick={refreshRooms}
            style={{ padding: '0.45rem', borderRadius: 'var(--radius-sm)', color: 'var(--text-muted)' }}
            title="Refresh Threads"
          >
            <RefreshCw size={15} />
          </button>
        </div>

        {/* Rooms Scroll List */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          {filteredRooms.length === 0 ? (
            <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              No chat threads found
            </div>
          ) : (
            filteredRooms.map((r) => {
              const isActive = r.id === activeRoom?.id;
              return (
                <div
                  key={r.id}
                  onClick={() => setActiveRoomId(r.id)}
                  style={{
                    padding: '0.9rem 1rem',
                    borderBottom: '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    background: isActive ? 'rgba(217, 119, 6, 0.1)' : 'transparent',
                    borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent',
                    transition: 'background 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: isActive ? 'var(--primary)' : 'var(--text-primary)' }}>
                      {r.customer_name}
                    </div>
                    {r.unread_admin_count > 0 && (
                      <span
                        style={{
                          background: '#EF4444',
                          color: '#FFFFFF',
                          borderRadius: '50%',
                          padding: '0.1rem 0.45rem',
                          fontSize: '0.7rem',
                          fontWeight: 800
                        }}
                      >
                        {r.unread_admin_count}
                      </span>
                    )}
                  </div>

                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                    {r.customer_company ? `${r.customer_company} • ` : ''}{r.customer_country}
                  </div>

                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {r.last_message || 'New conversation'}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 2. Middle Column: Active Live Chat Window */}
      <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--bg-surface-elevated)' }}>
        {activeRoom ? (
          <>
            {/* Chat Header */}
            <div style={{ padding: '0.85rem 1.5rem', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--botanical))', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                  {activeRoom.customer_name?.charAt(0) || 'B'}
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>{activeRoom.customer_name}</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Globe size={12} /> {activeRoom.customer_country} {activeRoom.customer_company && `• ${activeRoom.customer_company}`}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="badge badge-green" style={{ fontSize: '0.7rem' }}>
                  <span className="live-pulse" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981' }} /> Live Room
                </span>
              </div>
            </div>

            {/* Canned Quick Responses Bar */}
            <div style={{ padding: '0.5rem 1rem', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', gap: '0.5rem', overflowX: 'auto' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.3rem', whiteSpace: 'nowrap' }}>
                <Sparkles size={13} /> Quick Export Replies:
              </span>
              {cannedReplies.map((r, idx) => (
                <button
                  key={idx}
                  onClick={() => sendAdminMessage(r)}
                  style={{
                    padding: '0.25rem 0.65rem',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.72rem',
                    color: 'var(--text-secondary)',
                    whiteSpace: 'nowrap',
                    cursor: 'pointer'
                  }}
                  title={r}
                >
                  {r.substring(0, 32)}...
                </button>
              ))}
            </div>

            {/* Messages Feed */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {messages.map((m) => {
                const isAdmin = m.sender_type === 'admin';
                const isSystem = m.sender_type === 'system';

                if (isSystem) {
                  return (
                    <div
                      key={m.id}
                      style={{
                        padding: '0.5rem 0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        background: 'rgba(217, 119, 6, 0.1)',
                        border: '1px solid rgba(217, 119, 6, 0.2)',
                        fontSize: '0.78rem',
                        color: 'var(--text-secondary)',
                        textAlign: 'center',
                        margin: '0 auto',
                        maxWidth: '85%'
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
                      alignItems: isAdmin ? 'flex-end' : 'flex-start',
                      maxWidth: '75%',
                      alignSelf: isAdmin ? 'flex-end' : 'flex-start'
                    }}
                  >
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                      {isAdmin ? 'You (Colombo HQ)' : (m.sender_name || 'Buyer')}
                    </div>
                    <div
                      style={{
                        padding: '0.75rem 1rem',
                        borderRadius: isAdmin ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                        background: isAdmin ? 'var(--primary)' : 'var(--bg-surface)',
                        color: isAdmin ? '#FFFFFF' : 'var(--text-primary)',
                        border: isAdmin ? 'none' : '1px solid var(--border-subtle)',
                        boxShadow: 'var(--shadow-sm)',
                        fontSize: '0.9rem',
                        lineHeight: 1.4,
                        wordBreak: 'break-word'
                      }}
                    >
                      {m.message_text}
                    </div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <span>{m.created_at ? new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'}</span>
                      {isAdmin && <CheckCheck size={12} color="#10B981" />}
                    </div>
                  </div>
                );
              })}

              {isCustomerTyping && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  <span className="live-pulse" style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)' }} />
                  <span>Customer is typing...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input form */}
            <form
              onSubmit={handleSend}
              style={{ padding: '0.85rem 1.5rem', background: 'var(--bg-surface)', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: '0.75rem', alignItems: 'center' }}
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                  handleStartTyping();
                }}
                placeholder="Type your export advisory reply or quotation details..."
                style={{ flex: 1, padding: '0.65rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface-elevated)', color: 'var(--text-primary)', outline: 'none' }}
              />
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!inputText.trim()}
                style={{ padding: '0.65rem 1.25rem' }}
              >
                <Send size={16} />
                <span>Send</span>
              </button>
            </form>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            Select a live chat thread to begin messaging.
          </div>
        )}
      </div>

      {/* 3. Right Column: Customer Details Snapshot */}
      <div style={{ borderLeft: '1px solid var(--border-subtle)', padding: '1.5rem', background: 'var(--bg-surface)', overflowY: 'auto' }}>
        <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <User size={16} color="var(--primary)" /> Buyer Dossier
        </h4>

        {activeRoom ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.85rem' }}>
            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Name & Title:</span>
              <strong>{activeRoom.customer_name}</strong>
            </div>

            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Company / Brand:</span>
              <strong>{activeRoom.customer_company || 'Private Buyer / Not Specified'}</strong>
            </div>

            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Destination Market:</span>
              <strong style={{ color: '#047857' }}>{activeRoom.customer_country}</strong>
            </div>

            <div style={{ padding: '1rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontWeight: 700, fontSize: '0.8rem', marginBottom: '0.35rem' }}>Colombo Port Routing:</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                Primary container feeder: <strong>Direct CMB → European / Asian discharge</strong>
              </div>
            </div>
          </div>
        ) : (
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No customer selected</p>
        )}
      </div>
    </div>
  );
}
