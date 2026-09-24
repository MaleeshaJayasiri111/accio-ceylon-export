import React, { useState, useEffect } from 'react';
import { MessageSquare, X } from 'lucide-react';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';
import { AdminChatProvider, useAdminChat } from './context/AdminChatContext';

import AdminSidebar from './components/AdminSidebar';
import AdminHeader from './components/AdminHeader';

import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminChatCenter from './pages/AdminChatCenter';
import AdminProducts from './pages/AdminProducts';
import AdminOrders from './pages/AdminOrders';
import AdminReviews from './pages/AdminReviews';
import AdminCustomers from './pages/AdminCustomers';
import AdminSettings from './pages/AdminSettings';

function AdminAppContent() {
  const { adminUser, loading } = useAdminAuth();
  const { toast, closeToast, setActiveRoomId } = useAdminChat();
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem('accio_admin_theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('accio_admin_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-main)', color: 'var(--text-muted)' }}>
        Verifying Accio administrative session...
      </div>
    );
  }

  if (!adminUser) {
    return <AdminLoginPage />;
  }

  const tabTitles = {
    dashboard: 'Export Operations Dashboard Overview',
    chat: 'Bi-Directional Live Chat Center',
    orders: 'Export Orders & Shipment Pipeline',
    products: 'Export Product Catalog',
    reviews: 'Customer Review & Packaging Moderation',
    customers: 'Registered Importer Directory',
    settings: 'Company Profile, Contact Sync & Database Management'
  };

  let contentComponent = null;
  if (currentTab === 'dashboard') {
    contentComponent = <AdminDashboard setCurrentTab={setCurrentTab} setSelectedOrderId={setSelectedOrderId} />;
  } else if (currentTab === 'chat') {
    contentComponent = <AdminChatCenter />;
  } else if (currentTab === 'orders') {
    contentComponent = <AdminOrders selectedOrderId={selectedOrderId} onClearSelectedOrder={() => setSelectedOrderId(null)} />;
  } else if (currentTab === 'products') {
    contentComponent = <AdminProducts />;
  } else if (currentTab === 'reviews') {
    contentComponent = <AdminReviews />;
  } else if (currentTab === 'customers') {
    contentComponent = <AdminCustomers setCurrentTab={setCurrentTab} />;
  } else if (currentTab === 'settings') {
    contentComponent = <AdminSettings />;
  }

  return (
    <div className="admin-layout">
      <AdminSidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      <div className="admin-main">
        <AdminHeader
          theme={theme}
          toggleTheme={toggleTheme}
          title={tabTitles[currentTab] || 'Accio Admin'}
        />

        <main className="admin-content">
          {contentComponent}
        </main>
      </div>

      {/* Global Real-Time Customer Message Notification Toast */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            top: '1.5rem',
            right: '1.5rem',
            zIndex: 1000,
            maxWidth: '380px',
            background: 'var(--bg-surface)',
            border: '1px solid var(--primary)',
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
            padding: '1rem 1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary)' }}>
              <span className="live-pulse" style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#EF4444' }} />
              <span>🔔 New Message ({toast.time})</span>
            </div>
            <button onClick={closeToast} style={{ color: 'var(--text-muted)' }}>
              <X size={16} />
            </button>
          </div>

          <div>
            <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {toast.senderName}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#047857', fontWeight: 600, marginBottom: '0.35rem' }}>
              {toast.company ? `${toast.company} • ` : ''}{toast.country}
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', background: 'var(--bg-surface-elevated)', padding: '0.45rem 0.65rem', borderRadius: '4px', margin: 0, wordBreak: 'break-word' }}>
              "{toast.messageText}"
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.25rem' }}>
            <button className="btn-secondary btn-sm" onClick={closeToast}>Dismiss</button>
            <button
              className="btn-primary btn-sm"
              onClick={() => {
                setActiveRoomId(toast.roomId);
                setCurrentTab('chat');
                closeToast();
              }}
            >
              <MessageSquare size={14} /> Open Chat
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AdminAuthProvider>
      <AdminChatProvider>
        <AdminAppContent />
      </AdminChatProvider>
    </AdminAuthProvider>
  );
}
