import React from 'react';
import {
  LayoutDashboard, MessageSquare, Package, Truck,
  Star, Users, Settings, ExternalLink, LogOut, ShieldCheck, Sun
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useAdminChat } from '../context/AdminChatContext';

export default function AdminSidebar({ currentTab, setCurrentTab }) {
  const { adminUser, logout } = useAdminAuth();
  const { totalUnreadChats } = useAdminChat();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'chat', label: 'Live Chat Center', icon: MessageSquare, badge: totalUnreadChats },
    { id: 'orders', label: 'Orders & Export Pipeline', icon: Truck },
    { id: 'products', label: 'Product Catalog', icon: Package },
    { id: 'reviews', label: 'Review Moderation', icon: Star },
    { id: 'customers', label: 'Customer Directory', icon: Users },
    { id: 'settings', label: 'Company & Profile Settings', icon: Settings }
  ];

  return (
    <aside className="admin-sidebar">
      {/* Brand Header */}
      <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: 'linear-gradient(135deg, #D97706 0%, #047857 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M12 6 C8 10 7 15 12 18 C17 15 16 10 12 6 Z" fill="#FDFBF7" />
          </svg>
        </div>
        <div>
          <h2 style={{ fontSize: '1.15rem', color: '#FFFFFF', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            ACCIO ADMIN
          </h2>
          <span style={{ fontSize: '0.72rem', color: '#D97706', fontWeight: 600 }}>
            COLOMBO EXPORT HUB
          </span>
        </div>
      </div>

      {/* Navigation List */}
      <nav style={{ padding: '1.25rem 0.75rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.88rem',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? 'var(--sidebar-text-active)' : 'var(--sidebar-text)',
                background: isActive ? 'rgba(217, 119, 6, 0.15)' : 'transparent',
                borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent',
                textAlign: 'left'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Icon size={18} color={isActive ? 'var(--primary)' : 'currentColor'} />
                <span>{item.label}</span>
              </div>
              {item.badge > 0 && (
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
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Public Site Quick Link */}
      <div style={{ padding: '0.75rem 1rem' }}>
        <a
          href="http://localhost:3000"
          target="_blank"
          rel="noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.65rem 0.85rem',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(255, 255, 255, 0.05)',
            fontSize: '0.8rem',
            color: '#CBD5E1',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <span>Open Public Store</span>
          <ExternalLink size={14} />
        </a>
      </div>

      {/* User Info & Sign Out Footer */}
      <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', overflow: 'hidden' }}>
          <img
            src={adminUser?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
            alt="Admin Avatar"
            style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
          />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {adminUser?.full_name || 'Admin'}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Export Manager</div>
          </div>
        </div>

        <button
          onClick={logout}
          style={{ color: '#EF4444', padding: '0.35rem' }}
          title="Sign Out of Admin Console"
        >
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
}
