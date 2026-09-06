import React, { useState, useEffect } from 'react';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';
import { AdminChatProvider } from './context/AdminChatContext';

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
    products: 'Export Product Catalog (CRUD)',
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
