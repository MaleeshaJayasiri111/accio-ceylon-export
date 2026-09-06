import React from 'react';
import { Sun, Moon, Anchor, ShieldCheck, Bell, Search } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useAdminChat } from '../context/AdminChatContext';

export default function AdminHeader({ theme, toggleTheme, title }) {
  const { adminUser } = useAdminAuth();
  const { totalUnreadChats } = useAdminChat();

  return (
    <header className="admin-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{title}</h1>
        <span className="badge badge-green" style={{ fontSize: '0.7rem' }}>
          <Anchor size={11} /> Colombo Port Operations: ONLINE
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Live chat alert badge */}
        {totalUnreadChats > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-full)', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid #EF4444', color: '#DC2626', fontSize: '0.8rem', fontWeight: 700 }}>
            <span className="live-pulse" style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#EF4444' }} />
            <span>{totalUnreadChats} New Buyer Inquiries</span>
          </div>
        )}

        {/* Theme toggle */}
        <button
          className="btn-secondary"
          onClick={toggleTheme}
          style={{ width: '36px', height: '36px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-sm)' }}
          title="Toggle Dark/Light Mode"
        >
          {theme === 'dark' ? <Sun size={16} color="#F59E0B" /> : <Moon size={16} color="#475569" />}
        </button>

        {/* Admin info badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', paddingLeft: '0.75rem', borderLeft: '1px solid var(--border-subtle)' }}>
          <img
            src={adminUser?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
            alt={adminUser?.full_name}
            style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
          />
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, lineHeight: 1.2 }}>{adminUser?.full_name}</div>
            <span style={{ fontSize: '0.7rem', color: '#047857', fontWeight: 600 }}>Super Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
}
