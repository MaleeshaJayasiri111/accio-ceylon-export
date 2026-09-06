import React, { useState, useEffect } from 'react';
import {
  ShieldCheck, Anchor, ArrowLeft, Plus, Check, Star,
  Award, Package, Truck, CheckCircle2, ChevronRight
} from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import { useCart } from '../context/CartContext';
import { useChat } from '../context/ChatContext';

export default function ProductDetailPage({ productSlug, navigate, onOpenReviewModal }) {
  const { formatPrice } = useCurrency();
  const { addToCart } = useCart();
  const { setIsOpen: setChatOpen } = useChat();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedPack, setSelectedPack] = useState(null);
  const [quantityKg, setQuantityKg] = useState(25);
  const [isSampleMode, setIsSampleMode] = useState(false);

  useEffect(() => {
    fetch(`/api/products/${productSlug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.product) {
          setProduct(data.product);
          setReviews(data.reviews || []);
          if (data.product.packaging_types?.length > 0) {
            setSelectedPack(data.product.packaging_types[0]);
          }
          if (data.product.moq_kg) {
            setQuantityKg(data.product.moq_kg);
          }
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [productSlug]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading product specifications...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <h2>Product not found</h2>
        <button className="btn btn-primary" onClick={() => navigate('/products')} style={{ marginTop: '1rem' }}>
          Back to Catalog
        </button>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : ['/products/ceylon_mango.jpg'];

  const handleAddCart = () => {
    addToCart(product, {
      packType: selectedPack ? `${selectedPack.type} (${selectedPack.size})` : 'Export Grade',
      quantityKg: isSampleMode ? 1 : Number(quantityKg),
      isSample: isSampleMode
    });
  };

  return (
    <div style={{ padding: '2.5rem 0 6rem' }}>
      <div className="container">
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
          <button onClick={() => navigate('/')} style={{ color: 'inherit' }}>Home</button>
          <ChevronRight size={14} />
          <button onClick={() => navigate('/products')} style={{ color: 'inherit' }}>Products</button>
          <ChevronRight size={14} />
          <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{product.name}</span>
        </div>

        {/* Top Product Hero */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3.5rem', marginBottom: '5rem' }}>
          {/* Gallery */}
          <div>
            <div
              className="glass-panel"
              style={{
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                height: '420px',
                marginBottom: '1rem',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-surface)'
              }}
            >
              <img
                src={images[activeImage]}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => { e.target.src = '/products/ceylon_mango.jpg'; }}
              />
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    style={{
                      width: '75px',
                      height: '75px',
                      borderRadius: 'var(--radius-sm)',
                      overflow: 'hidden',
                      border: activeImage === idx ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                      opacity: activeImage === idx ? 1 : 0.65,
                      flexShrink: 0
                    }}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { e.target.src = '/products/ceylon_mango.jpg'; }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Overview & Quote Builder */}
          <div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span className="badge badge-amber">{product.category}</span>
              <span className="badge badge-green">Origin: {product.origin_region}</span>
              <span className="badge badge-amber">Moisture: {product.moisture_level}</span>
            </div>

            <h1 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '0.75rem', lineHeight: 1.2 }}>
              {product.name}
            </h1>

            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              {product.description}
            </p>

            {/* FOB Base Price */}
            <div style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>FOB Port of Colombo Base:</span>
                <strong style={{ fontSize: '1.8rem', color: 'var(--primary)', fontWeight: 900 }}>
                  {formatPrice(product.fob_price_usd)} / kg
                </strong>
              </div>
              <div style={{ fontSize: '0.78rem', color: '#047857', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Anchor size={14} /> Includes export palletization, phytosanitary COA, & Colombo customs loading
              </div>
            </div>

            {/* Packaging Options */}
            {product.packaging_types && product.packaging_types.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.6rem' }}>
                  Select Packaging Format:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.5rem' }}>
                  {product.packaging_types.map((pkg, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedPack(pkg)}
                      style={{
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-sm)',
                        background: selectedPack?.type === pkg.type ? 'rgba(217, 119, 6, 0.08)' : 'var(--bg-surface)',
                        border: selectedPack?.type === pkg.type ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{pkg.type} ({pkg.size})</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{pkg.retailBox}</div>
                      </div>
                      {selectedPack?.type === pkg.type && <Check size={18} color="var(--primary)" />}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Order Mode Toggle */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', background: 'var(--bg-surface-elevated)', padding: '0.35rem', borderRadius: 'var(--radius-sm)' }}>
              <button
                type="button"
                onClick={() => setIsSampleMode(false)}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  borderRadius: 'var(--radius-sm)',
                  background: !isSampleMode ? 'var(--primary)' : 'transparent',
                  color: !isSampleMode ? '#FFFFFF' : 'var(--text-secondary)'
                }}
              >
                Wholesale FOB (MOQ {product.moq_kg}kg)
              </button>
              <button
                type="button"
                onClick={() => setIsSampleMode(true)}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  borderRadius: 'var(--radius-sm)',
                  background: isSampleMode ? 'var(--primary)' : 'transparent',
                  color: isSampleMode ? '#FFFFFF' : 'var(--text-secondary)'
                }}
              >
                Sample Air Pack (1 Kit)
              </button>
            </div>

            {/* Quantity Input */}
            {!isSampleMode && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <label style={{ fontSize: '0.88rem', fontWeight: 600 }}>Cargo Volume (KG):</label>
                <input
                  type="number"
                  min={product.moq_kg || 10}
                  step={5}
                  value={quantityKg}
                  onChange={(e) => setQuantityKg(Math.max(product.moq_kg || 10, parseInt(e.target.value) || 0))}
                  style={{ width: '110px', padding: '0.55rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', fontWeight: 700, fontSize: '1rem' }}
                />
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Total: <strong>{formatPrice(product.fob_price_usd * quantityKg)}</strong>
                </span>
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                className="btn btn-primary"
                onClick={handleAddCart}
                style={{ flex: 1, padding: '0.9rem', fontSize: '1rem' }}
              >
                <Plus size={18} />
                <span>{isSampleMode ? 'Add Sample Pack to Cart' : 'Add to Export Quote'}</span>
              </button>

              <button
                className="btn btn-secondary"
                onClick={() => setChatOpen(true)}
                style={{ padding: '0.9rem 1.4rem' }}
              >
                <span>Live Chat Inquiry</span>
              </button>
            </div>
          </div>
        </div>

        {/* Lab Specs & Certifications Section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '5rem' }}>
          {/* Nutrition / Specs Card */}
          <div className="glass-panel" style={{ borderRadius: 'var(--radius-md)', padding: '1.75rem', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award size={20} color="var(--primary)" /> Laboratory Specs & Nutrition
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Moisture Level:</span>
                <strong>{product.moisture_level}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Shelf Life:</span>
                <strong>{product.shelf_life} (Ambient)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Water Activity (aw):</span>
                <strong>&lt; 0.60 aw (Microbiologically Stable)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Added Sugar / Preservatives:</span>
                <strong style={{ color: '#047857' }}>0% Pure Ceylon Fruit</strong>
              </div>
              {product.nutrition_facts && Object.entries(product.nutrition_facts).map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
                  <span style={{ color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{k.replace('_', ' ')}:</span>
                  <strong>{v}</strong>
                </div>
              ))}
            </div>
          </div>

          {/* Export Compliance Card */}
          <div className="glass-panel" style={{ borderRadius: 'var(--radius-md)', padding: '1.75rem', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={20} color="#047857" /> Export Compliance & Certificates
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
              {product.certifications?.map((c, i) => (
                <span key={i} className="badge badge-green" style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}>
                  <CheckCircle2 size={13} /> {c}
                </span>
              ))}
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Every export batch is accompanied by Sri Lanka Export Development Board (EDB) certified Phytosanitary Certificate, Certificate of Origin (Form A/EUR.1 compliant), and official laboratory moisture/purity analytical reports.
            </p>
          </div>
        </div>

        {/* Product Reviews Showcase */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Verified Importer Reviews ({reviews.length})</h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Feedback from wholesale buyers who inspected and tested this Ceylon harvest.
              </p>
            </div>
            <button className="btn btn-primary btn-sm" onClick={onOpenReviewModal}>
              Write a Review
            </button>
          </div>

          {reviews.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)' }}>
              No reviews yet for this product. Be the first international buyer to leave feedback!
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.75rem' }}>
              {reviews.map((r) => (
                <div
                  key={r.id}
                  className="glass-panel"
                  style={{ borderRadius: 'var(--radius-md)', padding: '1.5rem', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column' }}
                >
                  {r.photo_urls && r.photo_urls.length > 0 && (
                    <div style={{ height: '180px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', marginBottom: '1rem', border: '1px solid var(--border-subtle)' }}>
                      <img
                        src={r.photo_urls[0]}
                        alt="Customer packaging inspection"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => { e.target.src = '/reviews/review_mango_hand.jpg'; }}
                      />
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '0.2rem', color: '#F59E0B', marginBottom: '0.5rem' }}>
                    {[...Array(r.rating)].map((_, i) => (
                      <Star key={i} size={15} fill="#F59E0B" color="#F59E0B" />
                    ))}
                  </div>

                  <h4 style={{ fontSize: '0.98rem', fontWeight: 700, marginBottom: '0.35rem' }}>{r.title}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem', flex: 1 }}>{r.comment}</p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.8rem' }}>
                    <strong>{r.author_name}</strong>
                    <span style={{ color: 'var(--text-muted)' }}>• {r.author_country}</span>
                    <span className="badge badge-green" style={{ fontSize: '0.65rem', padding: '0.1rem 0.35rem' }}>Verified Buyer</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
