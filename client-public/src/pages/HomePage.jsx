import React, { useState, useEffect } from 'react';
import {
  Sun, ShieldCheck, Anchor, ArrowRight, Star, CheckCircle2,
  Package, Sparkles, TrendingUp, Award, Globe, Leaf, Eye, Plus
} from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import { useCart } from '../context/CartContext';
import { useChat } from '../context/ChatContext';

<<<<<<< HEAD
import { INITIAL_PRODUCTS, INITIAL_REVIEWS } from '../data/initialData';

=======
>>>>>>> ff90a80f041398752d8f7f52464d7c1c3b3736e0
export default function HomePage({ navigate, onOpenReviewModal }) {
  const { formatPrice } = useCurrency();
  const { addToCart } = useCart();
  const { setIsOpen: setChatOpen } = useChat();

<<<<<<< HEAD
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/products?featured=true')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.products && data.products.length > 0) setProducts(data.products);
      })
      .catch(() => {});

    fetch('/api/reviews?featured=true')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.reviews && data.reviews.length > 0) setReviews(data.reviews);
      })
      .catch(() => {});
  }, []);


=======
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/products?featured=true').then((r) => r.json()),
      fetch('/api/reviews?featured=true').then((r) => r.json())
    ])
      .then(([prodData, revData]) => {
        if (prodData.products) setProducts(prodData.products);
        if (revData.reviews) setReviews(revData.reviews);
      })
      .catch((err) => console.error('Failed to load homepage data:', err))
      .finally(() => setLoading(false));
  }, []);

>>>>>>> ff90a80f041398752d8f7f52464d7c1c3b3736e0
  return (
    <div>
      {/* 1. HERO SECTION */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '4rem 0 5.5rem', background: 'radial-gradient(circle at 80% 20%, rgba(217, 119, 6, 0.12) 0%, transparent 60%), radial-gradient(circle at 10% 80%, rgba(4, 120, 87, 0.1) 0%, transparent 50%)' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3.5rem', alignItems: 'center' }}>
          {/* Left Hero Content */}
          <div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <span className="badge badge-amber">
                <Sun size={12} /> 100% Sub-48°C Solar Dehydrated
              </span>
              <span className="badge badge-green">
                <Anchor size={12} /> Direct from Colombo Port
              </span>
              <span className="badge badge-amber">
                <ShieldCheck size={12} /> 100% Pure Natural Fruit • Zero Additives
              </span>
            </div>

            <h1 style={{ fontSize: 'clamp(2.4rem, 4.5vw, 3.6rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '1.25rem' }}>
              Pristine <span style={{ color: 'var(--primary)' }}>Ceylon Sunshine</span> in Every Bite.
            </h1>

            <p style={{ fontSize: '1.12rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '2rem', maxWidth: '540px' }}>
              We export Grade-A dehydrated tropical fruits, wild-harvested Beli fruit, and true Ceylon cinnamon from our state-of-the-art Colombo facility to premium distributors across the UK, Europe, Australia, and the Americas.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
              <button
                className="btn btn-primary"
                onClick={() => navigate('/products')}
                style={{ padding: '0.9rem 1.8rem', fontSize: '1rem' }}
              >
                <span>Explore Export Catalog</span>
                <ArrowRight size={18} />
              </button>

              <button
                className="btn btn-secondary"
                onClick={() => setChatOpen(true)}
                style={{ padding: '0.9rem 1.6rem', fontSize: '1rem' }}
              >
                <span>Live FOB Inquiry</span>
              </button>
            </div>

            {/* Quick Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border-subtle)' }}>
              <div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1 }}>&lt;10%</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>Moisture Level Preserved</div>
              </div>
              <div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#047857', lineHeight: 1 }}>24+</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>Export Destination Ports</div>
              </div>
              <div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>0%</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>Added Sugar & Sulfites</div>
              </div>
            </div>
          </div>

          {/* Right Hero Visual Showcase */}
          <div style={{ position: 'relative' }}>
            <div
              className="glass-panel"
              style={{
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                position: 'relative',
                boxShadow: 'var(--shadow-xl)',
                border: '1px solid var(--glass-border)'
              }}
            >
              <img
                src="/products/ceylon_mango.jpg"
                alt="Ceylon Dehydrated Mango Slices"
                style={{ width: '100%', height: '440px', objectFit: 'cover', display: 'block' }}
                onError={(e) => {
                  e.target.src = '/reviews/review_mango_table.png';
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(15, 23, 42, 0.85) 0%, rgba(15, 23, 42, 0.1) 60%, transparent 100%)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: '2rem',
                  color: '#FFFFFF'
                }}
              >
                <span className="badge badge-amber" style={{ width: 'fit-content', marginBottom: '0.5rem' }}>
                  Featured Export SKU
                </span>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.4rem' }}>
                  Ceylon Golden Mango Slices (Willard & Karthacolomban)
                </h3>
                <p style={{ fontSize: '0.85rem', opacity: 0.9, marginBottom: '1rem', lineHeight: 1.4 }}>
                  Naturally sweet fruit snacks in 50g matte white standup pouches and 10kg bulk master cartons.
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', opacity: 0.8, display: 'block' }}>FOB Colombo Base:</span>
                    <strong style={{ fontSize: '1.25rem', color: '#F59E0B' }}>{formatPrice(12.80)} / kg</strong>
                  </div>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      if (products[0]) addToCart(products[0]);
                    }}
                  >
                    <Plus size={15} /> Add to Quote Cart
                  </button>
                </div>
              </div>
            </div>

            {/* Floating Trust Badge */}
            <div
              className="glass-panel"
              style={{
                position: 'absolute',
                bottom: '-20px',
                left: '-20px',
                padding: '0.85rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                background: 'var(--bg-surface)',
                boxShadow: 'var(--shadow-lg)'
              }}
            >
              <div style={{ background: 'rgba(4, 120, 87, 0.15)', padding: '0.5rem', borderRadius: '50%' }}>
                <ShieldCheck size={24} color="#047857" />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>100% Phytosanitary Verified</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sri Lanka Dept. of Agriculture</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. LIVE COLOMBO PORT LOGISTICS TICKER */}
      <section style={{ background: 'var(--bg-surface-elevated)', borderY: '1px solid var(--border-subtle)', padding: '1.25rem 0' }}>
        <div className="container" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.9rem', color: 'var(--primary)' }}>
            <Anchor size={18} />
            <span>PORT OF COLOMBO TRANSIT SCHEDULES:</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <span>🇬🇧 London Gateway: <strong>14-16 Days</strong></span>
            <span>🇩🇪 Hamburg Port: <strong>16-18 Days</strong></span>
            <span>🇦🇪 Jebel Ali: <strong>4-5 Days</strong></span>
            <span>🇦🇺 Port Botany (Sydney): <strong>12-14 Days</strong></span>
            <span>🇺🇸 Port of LA: <strong>22-24 Days</strong></span>
          </div>
        </div>
      </section>

      {/* 3. WHY CEYLON DEHYDRATION VS SUN-DRYING MATRIX */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3.5rem' }}>
            <span className="badge badge-amber" style={{ marginBottom: '0.6rem' }}>Pioneering Technology</span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.75rem' }}>
              Why Accio Precision Dehydration Outperforms Traditional Drying
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
              Our closed-loop sub-48°C hygienic dehumidification chambers safeguard vibrant color, intense aromas, and heat-sensitive bio-nutrients.
            </p>
          </div>

          <div className="glass-panel" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.92rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-surface-elevated)', borderBottom: '2px solid var(--border-subtle)' }}>
                    <th style={{ padding: '1.25rem 1.5rem', fontWeight: 700, width: '28%' }}>Quality Parameter</th>
                    <th style={{ padding: '1.25rem 1.5rem', fontWeight: 700, color: 'var(--primary)', width: '36%' }}>Accio Solar & Low-Temp Chambers</th>
                    <th style={{ padding: '1.25rem 1.5rem', fontWeight: 600, color: 'var(--text-muted)', width: '36%' }}>Traditional Open Sun Drying</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '1.1rem 1.5rem', fontWeight: 600 }}>Drying Temperature</td>
                    <td style={{ padding: '1.1rem 1.5rem', color: '#047857', fontWeight: 600 }}>Controlled &lt; 48°C (Preserves active enzymes)</td>
                    <td style={{ padding: '1.1rem 1.5rem', color: 'var(--text-muted)' }}>Uncontrolled spikes up to 65°C+ (Degrades nutrients)</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '1.1rem 1.5rem', fontWeight: 600 }}>Sulfur Dioxide (SO2) / Preservatives</td>
                    <td style={{ padding: '1.1rem 1.5rem', color: '#047857', fontWeight: 600 }}>0.0% Clean Label (Zero chemicals added)</td>
                    <td style={{ padding: '1.1rem 1.5rem', color: 'var(--text-muted)' }}>Frequently bleached with SO2 to prevent browning</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '1.1rem 1.5rem', fontWeight: 600 }}>Hygiene & Dust Protection</td>
                    <td style={{ padding: '1.1rem 1.5rem', color: '#047857', fontWeight: 600 }}>HEPA-filtered cleanrooms (HACCP Certified)</td>
                    <td style={{ padding: '1.1rem 1.5rem', color: 'var(--text-muted)' }}>Exposed to outdoor wind, insects, and atmospheric dust</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '1.1rem 1.5rem', fontWeight: 600 }}>Moisture Uniformity & Water Activity (aw)</td>
                    <td style={{ padding: '1.1rem 1.5rem', color: '#047857', fontWeight: 600 }}>Constant aw &lt; 0.60 (Zero mold risk, 24-mo shelf life)</td>
                    <td style={{ padding: '1.1rem 1.5rem', color: 'var(--text-muted)' }}>High variance leading to premature spoilage</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '1.1rem 1.5rem', fontWeight: 600 }}>Packaging Formats</td>
                    <td style={{ padding: '1.1rem 1.5rem', color: '#047857', fontWeight: 600 }}>White Matte Standup Pouches, Kraft Bags & Bulk Liners</td>
                    <td style={{ padding: '1.1rem 1.5rem', color: 'var(--text-muted)' }}>Generic unsealed cartons</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURED PRODUCTS CATALOG */}
      <section style={{ padding: '4rem 0 5rem', background: 'var(--bg-surface-elevated)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="badge badge-amber" style={{ marginBottom: '0.4rem' }}>Export Ready SKUs</span>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 800 }}>Featured Ceylon Harvest</h2>
            </div>
            <button
              className="btn btn-secondary"
              onClick={() => navigate('/products')}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <span>View Full Catalog</span>
              <ArrowRight size={16} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
            {products.map((p) => (
              <div
                key={p.id}
                className="glass-panel"
                style={{
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.25s, box-shadow 0.25s'
                }}
              >
                <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
                  <img
                    src={p.images?.[0] || '/products/ceylon_mango.jpg'}
                    alt={p.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { e.target.src = '/products/ceylon_mango.jpg'; }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      top: '0.75rem',
                      left: '0.75rem',
                      background: 'rgba(15, 23, 42, 0.75)',
                      backdropFilter: 'blur(6px)',
                      color: '#FFFFFF',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      padding: '0.25rem 0.6rem',
                      borderRadius: 'var(--radius-full)'
                    }}
                  >
                    {p.category}
                  </span>
                </div>

                <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                    Origin: {p.origin_region}
                  </div>
                  <h3
                    onClick={() => navigate(`/products/${p.slug || p.id}`)}
                    style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', cursor: 'pointer', lineHeight: 1.3 }}
                  >
                    {p.name}
                  </h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1rem', flex: 1, lineHeight: 1.5 }}>
                    {p.short_desc}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1rem' }}>
                    <span className="badge badge-green" style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem' }}>
                      Moisture {p.moisture_level}
                    </span>
                    <span className="badge badge-amber" style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem' }}>
                      Shelf Life: {p.shelf_life}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                    <div>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>FOB Colombo:</span>
                      <strong style={{ fontSize: '1.15rem', color: 'var(--primary)' }}>{formatPrice(p.fob_price_usd)}/kg</strong>
                    </div>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button
                        className="btn-secondary btn-sm"
                        onClick={() => navigate(`/products/${p.slug || p.id}`)}
                        title="View Full Specs"
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        className="btn-primary btn-sm"
                        onClick={() => addToCart(p)}
                        title="Add to Quote Cart"
                      >
                        <Plus size={15} /> Quote
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. AUTHENTIC CUSTOMER FEEDBACK & REAL PACKAGING PHOTO SHOWCASE */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="badge badge-green" style={{ marginBottom: '0.4rem' }}>Verified Export Testimonials</span>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 800 }}>
                Global Importers Praise Our Authentic Packaging & Flavor
              </h2>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginTop: '0.3rem' }}>
                Unedited reviews and live photos received from verified distributors across the UK, Australia, Germany, and UAE.
              </p>
            </div>
            <button
              className="btn btn-primary"
              onClick={onOpenReviewModal}
            >
              <span>Submit Export Feedback</span>
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            {reviews.slice(0, 3).map((r) => (
              <div
                key={r.id}
                className="glass-panel"
                style={{
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.75rem',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {/* Photo showcase if attached */}
                {r.photo_urls && r.photo_urls.length > 0 && (
                  <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', height: '220px', marginBottom: '1.25rem', border: '1px solid var(--border-subtle)' }}>
                    <img
                      src={r.photo_urls[0]}
                      alt="Customer packaging feedback"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { e.target.src = '/reviews/review_mango_hand.jpg'; }}
                    />
                  </div>
                )}

                <div style={{ display: 'flex', gap: '0.2rem', color: '#F59E0B', marginBottom: '0.75rem' }}>
                  {[...Array(r.rating)].map((_, i) => (
                    <Star key={i} size={17} fill="#F59E0B" color="#F59E0B" />
                  ))}
                </div>

                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem', lineHeight: 1.3 }}>
                  "{r.title || 'Exceptional Quality'}"
                </h4>

                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem', flex: 1 }}>
                  {r.comment}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--botanical))', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem' }}>
                    {r.author_name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <span>{r.author_name}</span>
                      <CheckCircle2 size={14} color="#10B981" />
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {r.author_company ? `${r.author_company} • ` : ''}{r.author_country}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. EXPORT INQUIRY BANNER */}
      <section style={{ padding: '4rem 0 5rem', background: 'linear-gradient(135deg, var(--botanical-dark) 0%, #0F172A 100%)', color: '#FFFFFF' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
          <span className="badge badge-amber" style={{ marginBottom: '1rem' }}>Ready to Import Ceylon Pure Goodness?</span>
          <h2 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#FFFFFF', marginBottom: '1rem' }}>
            Request Your 2026 FOB/CIF Quotation & Sample Kit
          </h2>
          <p style={{ fontSize: '1.05rem', opacity: 0.9, lineHeight: 1.6, marginBottom: '2rem' }}>
            Custom packaging (OEM white label pouches, barcoded kraft pouches, and bulk master containers) available with swift dispatch from Colombo Port.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              className="btn btn-primary"
              onClick={() => navigate('/products')}
              style={{ padding: '0.9rem 2rem', fontSize: '1.05rem' }}
            >
              <span>Build Wholesale Quote</span>
              <ArrowRight size={18} />
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setChatOpen(true)}
              style={{ padding: '0.9rem 1.8rem', fontSize: '1.05rem', background: 'rgba(255,255,255,0.1)', color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.3)' }}
            >
              <span>Live Chat with Colombo Desk</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
