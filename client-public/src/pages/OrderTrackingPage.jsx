import React, { useState, useEffect } from 'react';
import { Search, Package, Truck, Anchor, CheckCircle2, Clock, MapPin, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

export default function OrderTrackingPage({ initialTracking = '' }) {
  const { formatPrice } = useCurrency();
  const [trackingNumber, setTrackingNumber] = useState(initialTracking || 'ACC-EXP-2026-7841');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (searchCode) => {
    const code = searchCode || trackingNumber;
    if (!code.trim()) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/orders/track/${encodeURIComponent(code.trim())}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Tracking reference not found');
      setOrder(data.order);
    } catch (err) {
      setError(err.message || 'Tracking reference not found. Try ACC-EXP-2026-7841 or ACC-EXP-2026-8924');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialTracking) {
      handleTrack(initialTracking);
    } else {
      handleTrack('ACC-EXP-2026-7841');
    }
  }, [initialTracking]);

  const stages = [
    { key: 'Inquiry', label: 'Export Inquiry', desc: 'Order specs received' },
    { key: 'Quotation Sent', label: 'Quotation Sent', desc: 'FOB/CIF rates verified' },
    { key: 'Payment Confirmed', label: 'Payment Confirmed', desc: 'Commercial invoice processed' },
    { key: 'Lab Tested', label: 'Lab QA & Moisture Test', desc: 'Moisture <10% verified' },
    { key: 'Customs Cleared', label: 'Colombo Customs Cleared', desc: 'Phytosanitary issued' },
    { key: 'Shipped (Colombo Port)', label: 'Vessel Dispatched', desc: 'Sailing Indian Ocean' },
    { key: 'Delivered', label: 'Discharged / Delivered', desc: 'Destination reached' }
  ];

  const getStageIndex = (status) => {
    const idx = stages.findIndex((s) => s.key.toLowerCase() === (status || '').toLowerCase());
    return idx > -1 ? idx : 0;
  };

  const currentStageIdx = order ? getStageIndex(order.status) : 0;

  return (
    <div style={{ padding: '3.5rem 0 6rem' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3rem' }}>
          <span className="badge badge-amber" style={{ marginBottom: '0.5rem' }}>Live Container & Cargo Tracking</span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.75rem' }}>
            Track Your Ceylon Export Shipment
          </h1>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
            Monitor real-time progress from Colombo dehydration facility through Colombo Port vessel loading to your destination harbor.
          </p>
        </div>

        {/* Tracking Search Form */}
        <div style={{ maxWidth: '640px', margin: '0 auto 3rem' }}>
          <form
            onSubmit={(e) => { e.preventDefault(); handleTrack(); }}
            style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-surface)', padding: '0.45rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-md)' }}
          >
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="Enter Tracking Reference (e.g. ACC-EXP-2026-7841)"
              style={{ flex: 1, padding: '0.75rem 1.25rem', border: 'none', background: 'transparent', outline: 'none', fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: 600 }}
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ borderRadius: 'var(--radius-full)', padding: '0.75rem 1.75rem' }}
            >
              <Search size={16} />
              <span>{loading ? 'Tracking...' : 'Track Cargo'}</span>
            </button>
          </form>

          {/* Quick Demo Pre-fills */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <span>Try sample tracking:</span>
            <button
              type="button"
              onClick={() => { setTrackingNumber('ACC-EXP-2026-7841'); handleTrack('ACC-EXP-2026-7841'); }}
              style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'underline' }}
            >
              ACC-EXP-2026-7841 (UK Shipped)
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => { setTrackingNumber('ACC-EXP-2026-8924'); handleTrack('ACC-EXP-2026-8924'); }}
              style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'underline' }}
            >
              ACC-EXP-2026-8924 (AU Cleared)
            </button>
          </div>
        </div>

        {error && (
          <div style={{ maxWidth: '640px', margin: '0 auto 2rem', padding: '1rem', borderRadius: 'var(--radius-md)', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #EF4444', color: '#DC2626', textAlign: 'center', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        {/* Order Details View */}
        {order && (
          <div className="glass-panel" style={{ borderRadius: 'var(--radius-lg)', padding: '2.5rem', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-lg)' }}>
            {/* Header Status Card */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1.75rem', borderBottom: '1px solid var(--border-subtle)', gap: '1rem', marginBottom: '2.5rem' }}>
              <div>
                <span className="badge badge-amber" style={{ marginBottom: '0.35rem' }}>
                  {order.order_type === 'sample' ? 'Sample Air Consignment' : 'Wholesale Ocean Freight'}
                </span>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 900 }}>Tracking: {order.tracking_number}</h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Customer: <strong>{order.customer_name}</strong> ({order.customer_company || 'Private Buyer'}) • {order.destination_country}
                </p>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Current Shipment Status:</span>
                <span className="badge badge-green" style={{ fontSize: '0.9rem', padding: '0.4rem 0.9rem', marginTop: '0.25rem' }}>
                  <Anchor size={14} /> {order.status}
                </span>
              </div>
            </div>

            {/* Stepper Progress Bar */}
            <div style={{ marginBottom: '3rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${stages.length}, 1fr)`, gap: '0.5rem', position: 'relative' }}>
                {stages.map((st, i) => {
                  const isDone = i <= currentStageIdx;
                  const isCurrent = i === currentStageIdx;
                  return (
                    <div key={st.key} style={{ textAlign: 'center' }}>
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          background: isDone ? 'linear-gradient(135deg, var(--primary), #F59E0B)' : 'var(--bg-surface-elevated)',
                          color: isDone ? '#FFFFFF' : 'var(--text-muted)',
                          border: isCurrent ? '3px solid var(--botanical)' : '1px solid var(--border-subtle)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 0.5rem',
                          fontWeight: 800,
                          fontSize: '0.85rem'
                        }}
                      >
                        {isDone ? <CheckCircle2 size={18} /> : i + 1}
                      </div>
                      <div style={{ fontSize: '0.75rem', fontWeight: isDone ? 700 : 500, color: isDone ? 'var(--text-primary)' : 'var(--text-muted)', lineHeight: 1.2 }}>
                        {st.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Shipment & Notes Details Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
              {/* Shipping Logistics */}
              <div style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Truck size={17} color="var(--primary)" /> Logistics Specifications
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Shipping Method:</span>
                    <strong>{order.shipping_method}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Destination Port:</span>
                    <strong>{order.destination_port}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Incoterms:</span>
                    <strong style={{ color: '#047857' }}>{order.incoterms || 'FOB Colombo'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Order Date:</span>
                    <strong>{order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'}</strong>
                  </div>
                </div>
              </div>

              {/* Port & Dispatch Notes */}
              <div style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Anchor size={17} color="#047857" /> Colombo Port Dispatch Log
                </h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {order.notes || 'Consignment undergoing standard quality inspection in Colombo cleanrooms prior to container loading.'}
                </p>
              </div>
            </div>

            {/* Items Manifest Table */}
            <div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem' }}>Export Manifest Items</h4>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg-surface-elevated)', borderBottom: '1px solid var(--border-subtle)' }}>
                      <th style={{ padding: '0.75rem 1rem' }}>Product Description</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Packaging Format</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Quantity</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Total (USD)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items?.map((item, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>{item.productName || item.name}</td>
                        <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)' }}>{item.packType}</td>
                        <td style={{ padding: '0.85rem 1rem' }}>{item.quantityKg} {order.order_type === 'sample' ? 'packs' : 'kg'}</td>
                        <td style={{ padding: '0.85rem 1rem', textAlign: 'right', fontWeight: 700, color: 'var(--primary)' }}>
                          {formatPrice(item.lineTotal || (item.unitPrice * item.quantityKg))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={3} style={{ padding: '1rem', fontWeight: 700, textAlign: 'right' }}>Declared FOB Total:</td>
                      <td style={{ padding: '1rem', fontWeight: 900, textAlign: 'right', fontSize: '1.15rem', color: 'var(--primary)' }}>
                        {formatPrice(order.total_amount)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
