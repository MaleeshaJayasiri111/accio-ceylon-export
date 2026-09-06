import React, { useState, useEffect } from 'react';
import {
  Truck, Search, Filter, Eye, FileText, CheckCircle2,
  Anchor, Clock, Edit, X, Printer, ShieldCheck
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';

export default function AdminOrders({ selectedOrderId, onClearSelectedOrder }) {
  const { token } = useAdminAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const [activeOrderModal, setActiveOrderModal] = useState(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  // Status update state
  const [newStatus, setNewStatus] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  const statuses = [
    'All', 'Inquiry', 'Quotation Sent', 'Payment Confirmed',
    'Lab Tested', 'Customs Cleared', 'Shipped (Colombo Port)', 'Delivered'
  ];

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.orders) {
        setOrders(data.orders);
        if (selectedOrderId) {
          const match = data.orders.find((o) => o.id === selectedOrderId);
          if (match) {
            handleOpenDetail(match);
          }
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token]);

  const handleOpenDetail = (order) => {
    setActiveOrderModal(order);
    setNewStatus(order.status);
    setNewNotes(order.notes || '');
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!activeOrderModal) return;

    setUpdating(true);
    try {
      const res = await fetch(`/api/orders/${activeOrderModal.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          status: newStatus,
          notes: newNotes
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update order');

      setActiveOrderModal(data.order);
      fetchOrders();
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const filtered = orders.filter((o) => {
    if (statusFilter !== 'All' && o.status !== statusFilter) return false;
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      o.tracking_number.toLowerCase().includes(term) ||
      o.customer_name.toLowerCase().includes(term) ||
      (o.customer_company && o.customer_company.toLowerCase().includes(term)) ||
      o.destination_country.toLowerCase().includes(term)
    );
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Filters Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        {/* Status Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8rem',
                fontWeight: 600,
                background: statusFilter === st ? 'var(--primary)' : 'var(--bg-surface)',
                color: statusFilter === st ? '#FFFFFF' : 'var(--text-primary)',
                border: statusFilter === st ? 'none' : '1px solid var(--border-subtle)',
                transition: 'all 0.2s'
              }}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{ position: 'relative', width: '280px', maxWidth: '100%' }}>
          <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search tracking / importer..."
            style={{ width: '100%', padding: '0.55rem 0.85rem 0.55rem 2.4rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', color: 'var(--text-primary)' }}
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Tracking Reference</th>
                <th>Importer & Destination</th>
                <th>Type & Incoterms</th>
                <th>Amount</th>
                <th>Current Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id}>
                  <td style={{ fontWeight: 700, color: 'var(--primary)' }}>
                    {o.tracking_number}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{o.customer_name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {o.customer_company ? `${o.customer_company} • ` : ''}{o.destination_country}
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-amber" style={{ fontSize: '0.7rem' }}>
                      {o.incoterms || 'FOB Colombo'}
                    </span>
                  </td>
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
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button className="btn-secondary btn-sm" onClick={() => handleOpenDetail(o)} title="Inspect & Update Status">
                        <Edit size={14} /> Update
                      </button>
                      <button
                        className="btn-secondary btn-sm"
                        onClick={() => {
                          setActiveOrderModal(o);
                          setIsInvoiceModalOpen(true);
                        }}
                        title="Print Proforma Invoice"
                      >
                        <FileText size={14} /> Invoice
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Status Update Modal */}
      {activeOrderModal && !isInvoiceModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div onClick={() => setActiveOrderModal(null)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }} />

          <div
            className="glass-card"
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '620px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '2rem',
              borderRadius: 'var(--radius-lg)',
              zIndex: 610,
              background: 'var(--bg-surface)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <span className="badge badge-amber">Export Order Status Pipeline</span>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginTop: '0.2rem' }}>
                  {activeOrderModal.tracking_number}
                </h3>
              </div>
              <button onClick={() => setActiveOrderModal(null)} style={{ color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', padding: '1rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Buyer:</span>
                <div><strong>{activeOrderModal.customer_name}</strong></div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{activeOrderModal.customer_company}</div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Destination Port:</span>
                <div><strong>{activeOrderModal.destination_port} ({activeOrderModal.destination_country})</strong></div>
                <div style={{ fontSize: '0.78rem', color: '#047857' }}>{activeOrderModal.shipping_method}</div>
              </div>
            </div>

            <form onSubmit={handleUpdateStatus} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                  Advance Export Pipeline Stage:
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface-elevated)', color: 'var(--text-primary)', fontWeight: 700 }}
                >
                  {statuses.filter((s) => s !== 'All').map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                  Colombo Port Dispatch / Phytosanitary Notes:
                </label>
                <textarea
                  rows={3}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="e.g. Vessel MSC ANNA container loaded at Colombo Harbor Terminal. Estimated arrival Sept 16."
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface-elevated)', color: 'var(--text-primary)' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setActiveOrderModal(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={updating}>
                  {updating ? 'Saving Status...' : 'Save Pipeline Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Proforma Invoice / Packing List Viewer Modal */}
      {activeOrderModal && isInvoiceModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div onClick={() => setIsInvoiceModalOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }} />

          <div
            className="glass-card"
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '750px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '2.5rem',
              borderRadius: 'var(--radius-lg)',
              zIndex: 610,
              background: '#FFFFFF',
              color: '#0F172A'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #D97706', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#D97706' }}>ACCIO EXPORT (PVT) LTD</h2>
                <p style={{ fontSize: '0.8rem', color: '#64748B' }}>Port Road, Colombo 01, Sri Lanka • export@accio-ceylon.com</p>
                <p style={{ fontSize: '0.8rem', color: '#64748B' }}>Registration: EDB-LK-2026-9901 • ISO 22000 & HACCP Certified</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>PROFORMA EXPORT INVOICE</h3>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#D97706' }}>{activeOrderModal.tracking_number}</div>
                <div style={{ fontSize: '0.78rem', color: '#64748B' }}>Date: {new Date(activeOrderModal.created_at).toLocaleDateString()}</div>
              </div>
            </div>

            {/* Buyer & Shipment Details Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem', fontSize: '0.85rem' }}>
              <div>
                <strong style={{ display: 'block', color: '#64748B', marginBottom: '0.25rem' }}>CONSIGNEE / BUYER:</strong>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{activeOrderModal.customer_name}</div>
                <div>{activeOrderModal.customer_company || 'Independent Importer'}</div>
                <div>{activeOrderModal.customer_email}</div>
                <div>{activeOrderModal.destination_country}</div>
              </div>

              <div>
                <strong style={{ display: 'block', color: '#64748B', marginBottom: '0.25rem' }}>PORT & SHIPPING PARAMETERS:</strong>
                <div>Loading Port: <strong>Port of Colombo (LK CMB)</strong></div>
                <div>Discharge Port: <strong>{activeOrderModal.destination_port}</strong></div>
                <div>Incoterms: <strong>{activeOrderModal.incoterms || 'FOB Colombo'}</strong></div>
                <div>Method: <strong>{activeOrderModal.shipping_method}</strong></div>
              </div>
            </div>

            {/* Manifest Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2rem', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #CBD5E1' }}>
                  <th style={{ padding: '0.65rem', textAlign: 'left' }}>Item Description & Packaging</th>
                  <th style={{ padding: '0.65rem', textAlign: 'right' }}>Quantity</th>
                  <th style={{ padding: '0.65rem', textAlign: 'right' }}>Unit FOB ($)</th>
                  <th style={{ padding: '0.65rem', textAlign: 'right' }}>Total (USD)</th>
                </tr>
              </thead>
              <tbody>
                {activeOrderModal.items?.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #E2E8F0' }}>
                    <td style={{ padding: '0.65rem' }}>
                      <div style={{ fontWeight: 700 }}>{item.productName || item.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{item.packType}</div>
                    </td>
                    <td style={{ padding: '0.65rem', textAlign: 'right' }}>{item.quantityKg} kg</td>
                    <td style={{ padding: '0.65rem', textAlign: 'right' }}>${item.unitPrice?.toFixed(2)}</td>
                    <td style={{ padding: '0.65rem', textAlign: 'right', fontWeight: 700 }}>
                      ${(item.lineTotal || (item.unitPrice * item.quantityKg)).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} style={{ padding: '0.85rem', fontWeight: 800, textAlign: 'right', fontSize: '1rem' }}>Total Declared Amount (USD):</td>
                  <td style={{ padding: '0.85rem', fontWeight: 900, textAlign: 'right', fontSize: '1.15rem', color: '#D97706' }}>
                    ${activeOrderModal.total_amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              </tfoot>
            </table>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E2E8F0', paddingTop: '1.25rem' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <ShieldCheck size={14} color="#047857" /> Authenticated by Sri Lanka Export Development Board
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-secondary btn-sm" onClick={() => window.print()}>
                  <Printer size={15} /> Print Document
                </button>
                <button className="btn btn-primary btn-sm" onClick={() => setIsInvoiceModalOpen(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
