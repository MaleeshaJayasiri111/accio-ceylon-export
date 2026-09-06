import React, { useState, useEffect } from 'react';
import {
  TrendingUp, Package, Truck, MessageSquare, Star,
  Globe, ArrowUpRight, Anchor, Clock, Users, ShieldCheck
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useAdminChat } from '../context/AdminChatContext';

export default function AdminDashboard({ setCurrentTab, setSelectedOrderId }) {
  const { token } = useAdminAuth();
  const { totalUnreadChats } = useAdminChat();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/stats/dashboard', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading analytics dashboard...</div>;
  }

  const metrics = stats?.metrics || {
    totalRevenue: 11495,
    totalKgExported: 850,
    activeOrders: 3,
    totalCustomers: 3,
    pendingReviews: 0,
    unreadChats: totalUnreadChats
  };

  const metricCards = [
    { title: 'Total Export Revenue', value: `$${metrics.totalRevenue.toLocaleString()}`, change: '+34.2% MoM', icon: TrendingUp, color: '#D97706' },
    { title: 'Export Volume', value: `${metrics.totalKgExported.toLocaleString()} KG`, sub: `${(metrics.totalKgExported / 1000).toFixed(2)} Metric Tons`, icon: Package, color: '#047857' },
    { title: 'Active Shipments', value: metrics.activeOrders, sub: 'In Transit / Port Clearance', icon: Truck, color: '#3B82F6' },
    { title: 'Live Inquiries', value: totalUnreadChats || metrics.unreadChats, sub: 'Unread Customer Messages', icon: MessageSquare, color: totalUnreadChats > 0 ? '#EF4444' : '#8B5CF6' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        {metricCards.map((c, i) => {
          const Icon = c.icon;
          return (
            <div key={i} className="glass-card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>{c.title}</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0.4rem 0 0.2rem', color: 'var(--text-primary)' }}>
                  {c.value}
                </div>
                <div style={{ fontSize: '0.75rem', color: c.change ? '#10B981' : 'var(--text-muted)', fontWeight: 600 }}>
                  {c.change || c.sub}
                </div>
              </div>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: `${c.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.color }}>
                <Icon size={22} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Country Breakdown & Recent Orders */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Country Export Distribution */}
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Globe size={18} color="var(--primary)" /> Top Export Destination Markets
            </h3>
            <span className="badge badge-amber" style={{ fontSize: '0.7rem' }}>FOB & CIF</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {stats?.countryStats?.map((c, i) => {
              const maxVal = stats.countryStats[0]?.total_value || 1;
              const percentage = Math.round((c.total_value / maxVal) * 100);
              return (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                    <span style={{ fontWeight: 600 }}>{c.destination_country}</span>
                    <span style={{ fontWeight: 700, color: 'var(--primary)' }}>${c.total_value.toLocaleString()} ({c.order_count} orders)</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', borderRadius: '4px', background: 'var(--bg-surface-elevated)', overflow: 'hidden' }}>
                    <div style={{ width: `${percentage}%`, height: '100%', borderRadius: '4px', background: 'linear-gradient(90deg, #D97706, #047857)' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Operations Box */}
        <div className="glass-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Anchor size={18} color="#047857" /> Colombo Export Desk Status
              </h3>
              <span className="badge badge-green">Operational</span>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              Colombo port deep-water container terminal operations are currently on schedule. Low-temperature solar dehydration chambers in Kurunegala and Colombo are running at full capacity (&lt;48°C).
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              <div>• Next scheduled vessel: <strong>MSC ANNA (London Gateway / Hamburg)</strong></div>
              <div>• Lab batch status: <strong>Batch LK-2026-MG09 (Moisture 8.4% PASSED)</strong></div>
              <div>• Phytosanitary certificate queue: <strong>0 pending approval</strong></div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button className="btn btn-primary" onClick={() => setCurrentTab('orders')} style={{ flex: 1 }}>
              Manage Orders Pipeline
            </button>
            <button className="btn btn-secondary" onClick={() => setCurrentTab('chat')} style={{ flex: 1 }}>
              Open Live Chat Hub
            </button>
          </div>
        </div>
      </div>

      {/* Recent Orders Pipeline Table */}
      <div className="glass-card" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Truck size={18} color="var(--primary)" /> Recent Export Orders & Inquiries
          </h3>
          <button className="btn btn-secondary btn-sm" onClick={() => setCurrentTab('orders')}>
            View All Orders →
          </button>
        </div>

        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Tracking #</th>
                <th>Importer / Company</th>
                <th>Destination</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentOrders?.map((o) => (
                <tr key={o.id}>
                  <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{o.tracking_number}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{o.customer_name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{o.customer_company || 'Private Buyer'}</div>
                  </td>
                  <td>{o.destination_country}</td>
                  <td style={{ fontWeight: 700 }}>${o.total_amount.toLocaleString()}</td>
                  <td>
                    <span className={`badge ${o.status.includes('Shipped') ? 'badge-green' : o.status.includes('Cleared') ? 'badge-blue' : 'badge-amber'}`}>
                      {o.status}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    {new Date(o.created_at).toLocaleDateString()}
                  </td>
                  <td>
                    <button
                      className="btn-secondary btn-sm"
                      onClick={() => {
                        setSelectedOrderId(o.id);
                        setCurrentTab('orders');
                      }}
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
