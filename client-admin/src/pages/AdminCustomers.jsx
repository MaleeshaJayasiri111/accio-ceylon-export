import React, { useState, useEffect } from 'react';
import { Users, Search, Mail, Phone, Building, Globe, MessageSquare, ShieldCheck, Eye, X, Calendar, RefreshCw, ShoppingCart } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useAdminChat } from '../context/AdminChatContext';
import { INITIAL_CUSTOMERS } from '../data/initialData';

export default function AdminCustomers({ setCurrentTab }) {
  const { token } = useAdminAuth();
  const { rooms, setActiveRoomId } = useAdminChat();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.users) {
          setUsers(data.users);
        }
      } else {
        setUsers(INITIAL_CUSTOMERS);
      }
    } catch (err) {
      console.error('Failed to load registered users:', err);
      setUsers(INITIAL_CUSTOMERS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const handleOpenCustomerChat = (user) => {
    const matchingRoom = rooms.find((r) => r.customer_id === user.id || (r.customer_name && r.customer_name.toLowerCase() === user.full_name.toLowerCase()));
    if (matchingRoom) {
      setActiveRoomId(matchingRoom.id);
    }
    setCurrentTab('chat');
  };

  const filtered = users.filter((u) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      (u.full_name && u.full_name.toLowerCase().includes(term)) ||
      (u.email && u.email.toLowerCase().includes(term)) ||
      (u.company_name && u.company_name.toLowerCase().includes(term)) ||
      (u.country && u.country.toLowerCase().includes(term)) ||
      (u.phone && u.phone.toLowerCase().includes(term))
    );
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Search & Action Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, maxWidth: '480px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search user by name, email, company, country..."
              style={{ width: '100%', padding: '0.55rem 0.85rem 0.55rem 2.4rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-primary)' }}
            />
          </div>
          <button
            onClick={fetchUsers}
            className="btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.55rem 0.85rem' }}
            title="Refresh Users List"
          >
            <RefreshCw size={14} className={loading ? 'live-pulse' : ''} />
            <span>Refresh</span>
          </button>
        </div>

        <span className="badge badge-green" style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}>
          {users.length} Registered Users & Buyers
        </span>
      </div>

      {/* Customers Table */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>User / Buyer Name</th>
                <th>Company / Brand</th>
                <th>Country</th>
                <th>Contact Details</th>
                <th>Role</th>
                <th>Orders</th>
                <th>Registered Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                    {loading ? 'Loading registered users...' : 'No registered users match your search.'}
                  </td>
                </tr>
              ) : (
                filtered.map((u) => (
                  <tr key={u.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedUser(u)}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--botanical))', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem' }}>
                          {u.full_name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{u.full_name}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>ID: {u.id?.substring(0, 16)}...</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <strong>{u.company_name || 'Individual Buyer'}</strong>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600, color: '#047857' }}>{u.country || 'Sri Lanka'}</span>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>{u.email}</div>
                      {u.phone && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{u.phone}</div>}
                    </td>
                    <td>
                      <span className={`badge ${u.role === 'admin' ? 'badge-amber' : 'badge-green'}`}>
                        {u.role === 'admin' ? 'Admin' : 'Registered Buyer'}
                      </span>
                    </td>
                    <td>
                      <strong>{u.order_count || 0}</strong>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {u.created_at ? new Date(u.created_at).toLocaleDateString() : 'Active'}
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button
                          className="btn-secondary btn-sm"
                          onClick={() => setSelectedUser(u)}
                          title="View Full Profile Details"
                        >
                          <Eye size={14} /> View
                        </button>
                        <button
                          className="btn-primary btn-sm"
                          onClick={() => handleOpenCustomerChat(u)}
                          title="Open Live Chat Thread"
                        >
                          <MessageSquare size={14} /> Chat
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div onClick={() => setSelectedUser(null)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }} />

          <div
            className="glass-card"
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '540px',
              padding: '2rem',
              borderRadius: 'var(--radius-lg)',
              zIndex: 610,
              background: 'var(--bg-surface)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--botanical))', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem' }}>
                  {selectedUser.full_name?.charAt(0) || 'U'}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{selectedUser.full_name}</h3>
                  <span className={`badge ${selectedUser.role === 'admin' ? 'badge-amber' : 'badge-green'}`} style={{ fontSize: '0.7rem' }}>
                    {selectedUser.role === 'admin' ? 'Accio Administrator' : 'Verified Registered Buyer'}
                  </span>
                </div>
              </div>
              <button onClick={() => setSelectedUser(null)} style={{ color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              <div style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Email Address</div>
                <div style={{ fontWeight: 700 }}>{selectedUser.email}</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Destination Country</div>
                  <div style={{ fontWeight: 700, color: '#047857' }}>{selectedUser.country || 'Sri Lanka'}</div>
                </div>
                <div style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Phone / Contact</div>
                  <div style={{ fontWeight: 700 }}>{selectedUser.phone || 'Not Provided'}</div>
                </div>
              </div>

              <div style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Company / Brand Organization</div>
                <div style={{ fontWeight: 700 }}>{selectedUser.company_name || 'Individual Buyer'}</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Registration Date</div>
                  <div style={{ fontWeight: 700 }}>{selectedUser.created_at ? new Date(selectedUser.created_at).toLocaleString() : 'Active'}</div>
                </div>
                <div style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Orders Placed</div>
                  <div style={{ fontWeight: 700, color: 'var(--primary)' }}>{selectedUser.order_count || 0} Orders</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setSelectedUser(null)}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  const u = selectedUser;
                  setSelectedUser(null);
                  handleOpenCustomerChat(u);
                }}
              >
                <MessageSquare size={16} /> Open Chat Thread
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
