import React, { useState } from 'react';
import { ShieldCheck, Anchor, Truck, CheckCircle2, ArrowRight, Package, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { useAuth } from '../context/AuthContext';

export default function CheckoutPage({ navigate }) {
  const { cartItems, totalWeightKg, totalAmountUsd, clearCart } = useCart();
  const { currency, formatPrice } = useCurrency();
  const { user } = useAuth();

  const [customerName, setCustomerName] = useState(user ? user.full_name : '');
  const [customerEmail, setCustomerEmail] = useState(user ? user.email : '');
  const [customerCompany, setCustomerCompany] = useState(user ? user.company_name : '');
  const [customerPhone, setCustomerPhone] = useState(user ? user.phone : '');
  const [destinationCountry, setDestinationCountry] = useState(user ? user.country : 'United Kingdom');
  const [destinationPort, setDestinationPort] = useState('London Gateway (GB LGP)');
  const [shippingMethod, setShippingMethod] = useState('Ocean Freight (FCL/LCL)');
  const [incoterms, setIncoterms] = useState('FOB Colombo');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  const countries = [
    'United Kingdom', 'Germany', 'Australia', 'United Arab Emirates',
    'United States', 'Japan', 'France', 'Netherlands', 'Singapore', 'Canada'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      setError('Your quote cart is empty.');
      return;
    }

    setLoading(true);
    setError('');

    const formattedItems = cartItems.map((item) => ({
      productId: item.productId,
      productName: item.name,
      quantityKg: item.quantityKg,
      packType: item.packType,
      unitPrice: item.unitPriceUsd,
      lineTotal: item.unitPriceUsd * item.quantityKg
    }));

    const isAllSamples = cartItems.every((i) => i.isSample);
    const orderType = isAllSamples ? 'sample' : (incoterms.startsWith('CIF') ? 'wholesale_cif' : 'wholesale_fob');

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(user ? { Authorization: `Bearer ${localStorage.getItem('accio_customer_token')}` } : {})
        },
        body: JSON.stringify({
          customer_name: customerName,
          customer_email: customerEmail,
          customer_company: customerCompany,
          customer_phone: customerPhone,
          destination_country: destinationCountry,
          destination_port: destinationPort,
          order_type: orderType,
          total_amount: totalAmountUsd,
          currency,
          shipping_method: shippingMethod,
          items: formattedItems,
          incoterms,
          notes
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit quote inquiry');

      setConfirmedOrder(data.order);
      clearCart();

      // Trigger confetti celebration
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {}
    } catch (err) {
      setError(err.message || 'Submission error');
    } finally {
      setLoading(false);
    }
  };

  if (confirmedOrder) {
    return (
      <div style={{ padding: '5rem 0 7rem' }}>
        <div className="container" style={{ maxWidth: '680px', margin: '0 auto', textAlign: 'center' }}>
          <div className="glass-panel" style={{ borderRadius: 'var(--radius-lg)', padding: '3rem 2rem', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-xl)' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(4, 120, 87, 0.15)', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <CheckCircle2 size={36} />
            </div>

            <span className="badge badge-green" style={{ marginBottom: '0.75rem' }}>
              Export Quotation Inquiry Dispatched
            </span>
            <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem' }}>
              Thank You, {confirmedOrder.customer_name}!
            </h1>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.6 }}>
              Your export order inquiry has been received at our Colombo headquarters. An export logistics manager has been assigned to prepare your formal Proforma Invoice and container loading schedule.
            </p>

            <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface-elevated)', border: '1px dashed var(--primary)', marginBottom: '2rem', textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.88rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Tracking Reference:</span>
                <strong style={{ color: 'var(--primary)', fontSize: '1.05rem' }}>{confirmedOrder.tracking_number}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.88rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Destination Port:</span>
                <strong>{confirmedOrder.destination_port} ({confirmedOrder.destination_country})</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Declared Total:</span>
                <strong style={{ fontSize: '1.1rem', color: 'var(--primary)' }}>{formatPrice(confirmedOrder.total_amount)}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                className="btn btn-primary"
                onClick={() => navigate(`/track?id=${confirmedOrder.tracking_number}`)}
              >
                <span>Track This Shipment Live</span>
                <ArrowRight size={16} />
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => navigate('/products')}
              >
                <span>Return to Catalog</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '3.5rem 0 6rem' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3rem' }}>
          <span className="badge badge-amber" style={{ marginBottom: '0.5rem' }}>Direct Export Procurement</span>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 900, marginBottom: '0.5rem' }}>
            Finalize Your Export Quotation & Order
          </h1>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
            Submit your consignment parameters to generate your official FOB/CIF Proforma Invoice and Phytosanitary schedule.
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <Package size={48} style={{ opacity: 0.3, margin: '0 auto 1rem' }} />
            <h3>Your quote cart is empty</h3>
            <button className="btn btn-primary" onClick={() => navigate('/products')} style={{ marginTop: '1rem' }}>
              Browse Ceylon Products
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem' }}>
            {/* Left Column: Buyer & Destination Form */}
            <div className="glass-panel" style={{ borderRadius: 'var(--radius-lg)', padding: '2rem', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Truck size={20} color="var(--primary)" /> Buyer & Destination Details
              </h3>

              {error && (
                <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #EF4444', color: '#DC2626', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                  {error}
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.3rem' }}>Full Name *</label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Oliver Wright"
                      style={{ width: '100%', padding: '0.65rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface-elevated)', color: 'var(--text-primary)' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.3rem' }}>Email Address *</label>
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="oliver@company.com"
                      style={{ width: '100%', padding: '0.65rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface-elevated)', color: 'var(--text-primary)' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.3rem' }}>Company / Brand</label>
                    <input
                      type="text"
                      value={customerCompany}
                      onChange={(e) => setCustomerCompany(e.target.value)}
                      placeholder="London Organic Snacks Ltd"
                      style={{ width: '100%', padding: '0.65rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface-elevated)', color: 'var(--text-primary)' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.3rem' }}>Phone / WhatsApp</label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+44 20 7946 0912"
                      style={{ width: '100%', padding: '0.65rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface-elevated)', color: 'var(--text-primary)' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.3rem' }}>Destination Country *</label>
                    <select
                      value={destinationCountry}
                      onChange={(e) => setDestinationCountry(e.target.value)}
                      style={{ width: '100%', padding: '0.65rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface-elevated)', color: 'var(--text-primary)' }}
                    >
                      {countries.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.3rem' }}>Discharge Port / Airport *</label>
                    <input
                      type="text"
                      required
                      value={destinationPort}
                      onChange={(e) => setDestinationPort(e.target.value)}
                      placeholder="e.g. London Gateway Port"
                      style={{ width: '100%', padding: '0.65rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface-elevated)', color: 'var(--text-primary)' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.3rem' }}>Incoterms Preference</label>
                  <select
                    value={incoterms}
                    onChange={(e) => setIncoterms(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface-elevated)', color: 'var(--text-primary)' }}
                  >
                    <option value="FOB Colombo">FOB Colombo (Port of Colombo, Sri Lanka)</option>
                    <option value="CIF Destination Port">CIF Destination Port (Includes Marine Freight & Insurance)</option>
                    <option value="DDP Air Express">DDP Air Express (Samples / Door-to-door)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.3rem' }}>Consignment Notes / OEM Packaging Specs</label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Provide any custom barcode, pouch branding, pallet dimensions, or target ship date requirements..."
                    style={{ width: '100%', padding: '0.65rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface-elevated)', color: 'var(--text-primary)' }}
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary Card */}
            <div className="glass-panel" style={{ borderRadius: 'var(--radius-lg)', padding: '2rem', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Package size={20} color="var(--primary)" /> Consignment Summary
              </h3>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
                {cartItems.map((item) => (
                  <div
                    key={item.itemKey}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>{item.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {item.packType} • {item.quantityKg} {item.isSample ? 'packs' : 'kg'}
                      </div>
                    </div>
                    <strong style={{ color: 'var(--text-primary)' }}>
                      {formatPrice(item.unitPriceUsd * item.quantityKg)}
                    </strong>
                  </div>
                ))}
              </div>

              <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface-elevated)', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Gross Cargo Weight:</span>
                  <strong>{totalWeightKg.toLocaleString()} KG</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Incoterms:</span>
                  <strong style={{ color: '#047857' }}>{incoterms}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.6rem', borderTop: '1px dashed var(--border-subtle)', fontSize: '1.2rem' }}>
                  <span style={{ fontWeight: 800 }}>Estimated Total:</span>
                  <strong style={{ color: 'var(--primary)', fontWeight: 900 }}>{formatPrice(totalAmountUsd)}</strong>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ width: '100%', padding: '0.9rem', fontSize: '1.05rem' }}
              >
                {loading ? 'Submitting Consignment...' : 'Submit Export Quotation'}
                <ArrowRight size={18} />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
