import React, { useState, useEffect } from 'react';
import { Users, Search, Mail, Phone, Building, Globe, MessageSquare, ShieldCheck } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useAdminChat } from '../context/AdminChatContext';

export default function AdminCustomers({ setCurrentTab }) {
  const { token } = useAdminAuth();
  const { rooms, setActiveRoomId } = useAdminChat();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('/api/auth/users', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.users) setUsers(data.users);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [token]);

  const handleOpenCustomerChat = (user) => {
    const matchingRoom = rooms.find((r) => r.customer_id === user.id || r.customer_name === user.full_name);
    if (matchingRoom) {
      setActiveRoomId(matchingRoom.id);
    }
    setCurrentTab('chat');
  };

  const filtered = users.filter((u) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      u.full_name.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term) ||
      (u.company_name && u.company_name.toLowerCase().includes(term)) ||
      u.country.toLowerCase().includes(term)
    );
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Search Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ position: 'relative', width: '320px', maxWidth: '100%' }}>
          <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search importer by name, company, country..."
            style={{ width: '100%', padding: '0.55rem 0.85rem 0.55rem 2.4rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-primary)' }}
          />
        </div>

        <span className="badge badge-green">
          {users.length} Registered Importers & Buyers
        </span>
      </div>

      {/* Customers Table */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Importer Name</th>
                <th>Company / Brand</th>
                <th>Country</th>
                <th>Contact Details</th>
                <th>Role</th>
                <th>Orders Placed</th>
                <th>Total Export Spend</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--botanical))', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem' }}>
                        {u.full_name.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700 }}>{u.full_name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Registered {new Date(u.created_at).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <strong>{u.company_name || 'Independent Buyer'}</strong>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600 }}>{u.country}</span>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.8rem' }}>{u.email}</div>
                    {u.phone && <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{u.phone}</div>}
                  </td>
                  <td>
                    <span className={`badge ${u.role === 'admin' ? 'badge-amber' : 'badge-green'}`}>
                      {u.role === 'admin' ? 'Admin' : 'Verified Buyer'}
                    </span>
                  </td>
                  <td>
                    <strong>{u.order_count || 0}</strong>
                  </td>
                  <td style={{ fontWeight: 700, color: 'var(--primary)' }}>
                    ${(u.total_spend || 0).toLocaleString()}
                  </td>
                  <td>
                    <button
                      className="btn-secondary btn-sm"
                      onClick={() => handleOpenCustomerChat(u)}
                      title="Open Live Chat Thread"
                    >
                      <MessageSquare size={14} /> Chat
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
