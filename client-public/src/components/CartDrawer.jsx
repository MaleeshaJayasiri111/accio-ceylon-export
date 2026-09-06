import React from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldAlert, Package, Anchor, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';

export default function CartDrawer({ onProceedCheckout }) {
  const { isDrawerOpen, setIsDrawerOpen, cartItems, updateQuantity, removeItem, clearCart, totalWeightKg, totalAmountUsd } = useCart();
  const { formatPrice } = useCurrency();

  if (!isDrawerOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 300, display: 'flex', justifyContent: 'flex-end' }}>
      {/* Backdrop */}
      <div
        onClick={() => setIsDrawerOpen(false)}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.55)',
          backdropFilter: 'blur(4px)'
        }}
      />

      {/* Drawer Panel */}
      <div
        className="glass-panel"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '480px',
          height: '100%',
          background: 'var(--bg-surface)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-xl)',
          borderLeft: '1px solid var(--border-subtle)',
          zIndex: 310
        }}
      >
        {/* Header */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Package size={20} color="var(--primary)" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Export Quote Cart</h3>
          </div>
          <button
            onClick={() => setIsDrawerOpen(false)}
            style={{ padding: '0.4rem', borderRadius: '50%', color: 'var(--text-secondary)' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Items List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              <Package size={48} style={{ opacity: 0.3, margin: '0 auto 1rem' }} />
              <p style={{ fontWeight: 600, fontSize: '1.05rem', marginBottom: '0.5rem' }}>Your quote cart is empty</p>
              <p style={{ fontSize: '0.85rem' }}>Select Ceylon dehydrated fruits, spices, or sample packs from our catalog to get a live FOB/CIF quote.</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.itemKey}
                style={{
                  display: 'flex',
                  gap: '1rem',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  style={{ width: '68px', height: '68px', borderRadius: 'var(--radius-sm)', objectFit: 'cover', flexShrink: 0 }}
                  onError={(e) => { e.target.src = '/products/ceylon_mango.jpg'; }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                    <h4 style={{ fontSize: '0.92rem', fontWeight: 700, lineHeight: 1.3 }}>{item.name}</h4>
                    <button
                      onClick={() => removeItem(item.itemKey)}
                      style={{ color: '#EF4444', padding: '0.2rem' }}
                      title="Remove item"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 600, marginBottom: '0.5rem' }}>
                    {item.packType} {item.isSample && <span className="badge badge-amber" style={{ padding: '0.1rem 0.4rem', fontSize: '0.65rem' }}>Sample Kit</span>}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {/* Quantity Controls */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '0.2rem 0.5rem' }}>
                      <button onClick={() => updateQuantity(item.itemKey, item.quantityKg - (item.isSample ? 1 : 10))}>
                        <Minus size={13} />
                      </button>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, minWidth: '35px', textAlign: 'center' }}>
                        {item.quantityKg} {item.isSample ? 'pk' : 'kg'}
                      </span>
                      <button onClick={() => updateQuantity(item.itemKey, item.quantityKg + (item.isSample ? 1 : 10))}>
                        <Plus size={13} />
                      </button>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                        {formatPrice(item.unitPriceUsd * item.quantityKg)}
                      </span>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        @{formatPrice(item.unitPriceUsd)}/{item.isSample ? 'pk' : 'kg'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer / Summary */}
        {cartItems.length > 0 && (
          <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-surface-elevated)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <span>Total Cargo Weight:</span>
              <strong style={{ color: 'var(--text-primary)' }}>{totalWeightKg.toLocaleString()} KG ({(totalWeightKg / 1000).toFixed(2)} MT)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <span>Export Dispatch Port:</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#047857', fontWeight: 600 }}>
                <Anchor size={13} /> Port of Colombo (LK CMB)
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem', paddingTop: '0.6rem', borderTop: '1px dashed var(--border-subtle)', fontSize: '1.15rem' }}>
              <span style={{ fontWeight: 700 }}>Estimated FOB Total:</span>
              <strong style={{ color: 'var(--primary)', fontWeight: 800 }}>{formatPrice(totalAmountUsd)}</strong>
            </div>

            <button
              className="btn btn-primary"
              onClick={() => {
                setIsDrawerOpen(false);
                onProceedCheckout();
              }}
              style={{ width: '100%', padding: '0.85rem', fontSize: '1rem' }}
            >
              <span>Proceed to Export Quotation / Order</span>
              <ArrowRight size={18} />
            </button>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.65rem' }}>
              <button
                onClick={clearCart}
                style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textDecoration: 'underline' }}
              >
                Clear Cart Items
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
