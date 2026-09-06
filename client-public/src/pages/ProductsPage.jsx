import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Eye, Check, ShieldCheck, Sparkles } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import { useCart } from '../context/CartContext';

import { INITIAL_PRODUCTS } from '../data/initialData';

export default function ProductsPage({ navigate }) {
  const { formatPrice } = useCurrency();
  const { addToCart } = useCart();

  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['All', 'Dehydrated Fruits', 'Ceylon Spices', 'Herbal Infusions'];

  useEffect(() => {
    let url = '/api/products';
    const params = new URLSearchParams();
    if (category !== 'All') params.append('category', category);
    if (searchTerm) params.append('search', searchTerm);
    if (params.toString()) url += `?${params.toString()}`;

    fetch(url)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.products && data.products.length > 0) {
          setProducts(data.products);
        } else {
          // Client-side fallback filtering
          let filtered = INITIAL_PRODUCTS;
          if (category !== 'All') {
            filtered = filtered.filter((p) => p.category === category);
          }
          if (searchTerm) {
            filtered = filtered.filter((p) =>
              p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              p.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
          }
          setProducts(filtered);
        }
      })
      .catch(() => {
        let filtered = INITIAL_PRODUCTS;
        if (category !== 'All') {
          filtered = filtered.filter((p) => p.category === category);
        }
        if (searchTerm) {
          filtered = filtered.filter((p) =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.description.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        setProducts(filtered);
      });
  }, [category, searchTerm]);


  return (
    <div style={{ padding: '3.5rem 0 6rem' }}>
      <div className="container">
        {/* Page Header */}
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3rem' }}>
          <span className="badge badge-amber" style={{ marginBottom: '0.5rem' }}>Direct Export From Colombo</span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.75rem' }}>Ceylon Export Products</h1>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
            Solar and precision low-temperature dehydrated tropical fruits, certified organic spices, and Ayurvedic wellness botanicals.
          </p>
        </div>

        {/* Filters & Search */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
          {/* Category Tabs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                style={{
                  padding: '0.55rem 1.1rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  background: category === cat ? 'var(--primary)' : 'var(--bg-surface-elevated)',
                  color: category === cat ? '#FFFFFF' : 'var(--text-primary)',
                  border: category === cat ? 'none' : '1px solid var(--border-subtle)',
                  transition: 'all 0.2s'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div style={{ position: 'relative', width: '280px', maxWidth: '100%' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search mango, beli, cinnamon..."
              style={{
                width: '100%',
                padding: '0.6rem 0.85rem 0.6rem 2.4rem',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-surface)',
                color: 'var(--text-primary)',
                outline: 'none'
              }}
            />
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
            Loading Ceylon harvest catalog...
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
            No products found matching your search.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
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
                  transition: 'all 0.25s'
                }}
              >
                <div style={{ position: 'relative', height: '230px', overflow: 'hidden' }}>
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

                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                    Origin: {p.origin_region}
                  </div>
                  <h3
                    onClick={() => navigate(`/products/${p.slug || p.id}`)}
                    style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem', cursor: 'pointer', lineHeight: 1.3 }}
                  >
                    {p.name}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem', flex: 1, lineHeight: 1.5 }}>
                    {p.short_desc}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.25rem' }}>
                    <span className="badge badge-green" style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}>
                      Moisture {p.moisture_level}
                    </span>
                    <span className="badge badge-amber" style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}>
                      Shelf Life: {p.shelf_life}
                    </span>
                    <span className="badge badge-green" style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}>
                      MOQ: {p.moq_kg} kg
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                    <div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>FOB Colombo:</span>
                      <strong style={{ fontSize: '1.25rem', color: 'var(--primary)' }}>{formatPrice(p.fob_price_usd)}/kg</strong>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        className="btn-secondary btn-sm"
                        onClick={() => navigate(`/products/${p.slug || p.id}`)}
                        title="View Full Technical Specs"
                      >
                        <Eye size={16} /> Specs
                      </button>
                      <button
                        className="btn-primary btn-sm"
                        onClick={() => addToCart(p)}
                        title="Add to Export Quote"
                      >
                        <Plus size={16} /> Quote
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
