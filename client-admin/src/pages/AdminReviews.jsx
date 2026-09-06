import React, { useState, useEffect } from 'react';
import {
  Star, Check, X, Trash2, Eye, Image,
  Sparkles, CheckCircle2, ShieldAlert
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';

export default function AdminReviews() {
  const { token } = useAdminAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [activePhoto, setActivePhoto] = useState(null);

  const fetchReviews = async () => {
    try {
      let url = '/api/reviews/admin';
      if (statusFilter !== 'All') url += `?status=${statusFilter}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.reviews) setReviews(data.reviews);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [statusFilter, token]);

  const handleModerate = async (id, status, isFeatured) => {
    try {
      const res = await fetch(`/api/reviews/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status, is_featured: isFeatured })
      });
      if (res.ok) fetchReviews();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this review entry?')) return;
    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchReviews();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {['All', 'approved', 'pending', 'rejected'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            style={{
              padding: '0.45rem 0.9rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.82rem',
              fontWeight: 600,
              textTransform: 'capitalize',
              background: statusFilter === st ? 'var(--primary)' : 'var(--bg-surface)',
              color: statusFilter === st ? '#FFFFFF' : 'var(--text-primary)',
              border: statusFilter === st ? 'none' : '1px solid var(--border-subtle)'
            }}
          >
            {st} Reviews
          </button>
        ))}
      </div>

      {/* Reviews Table / Grid */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Author & Country</th>
                <th>Harvest SKU</th>
                <th>Rating & Headline</th>
                <th>Packaging Photo</th>
                <th>Status</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((r) => (
                <tr key={r.id}>
                  <td>
                    <div style={{ fontWeight: 700 }}>{r.author_name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {r.author_company ? `${r.author_company} • ` : ''}{r.author_country}
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{r.product_name || 'Ceylon Mango'}</span>
                  </td>
                  <td style={{ maxWidth: '280px' }}>
                    <div style={{ display: 'flex', gap: '0.15rem', color: '#F59E0B', marginBottom: '0.2rem' }}>
                      {[...Array(r.rating)].map((_, i) => (
                        <Star key={i} size={13} fill="#F59E0B" />
                      ))}
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>"{r.title || 'Review'}"</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {r.comment}
                    </div>
                  </td>
                  <td>
                    {r.photo_urls && r.photo_urls.length > 0 ? (
                      <button
                        onClick={() => setActivePhoto(r.photo_urls[0])}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', fontSize: '0.75rem' }}
                      >
                        <Image size={14} color="var(--primary)" />
                        <span>View Photo</span>
                      </button>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>No photo</span>
                    )}
                  </td>
                  <td>
                    <span className={`badge ${r.status === 'approved' ? 'badge-green' : r.status === 'pending' ? 'badge-amber' : 'badge-red'}`}>
                      {r.status}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => handleModerate(r.id, r.status, !r.is_featured)}
                      style={{
                        padding: '0.25rem 0.6rem',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        background: r.is_featured ? 'rgba(217, 119, 6, 0.15)' : 'var(--bg-surface-elevated)',
                        color: r.is_featured ? 'var(--primary)' : 'var(--text-muted)',
                        border: '1px solid var(--border-subtle)'
                      }}
                    >
                      {r.is_featured ? '★ Featured' : 'Not Featured'}
                    </button>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      {r.status !== 'approved' && (
                        <button
                          className="btn-secondary btn-sm"
                          onClick={() => handleModerate(r.id, 'approved', r.is_featured)}
                          title="Approve Review"
                          style={{ color: '#10B981' }}
                        >
                          <Check size={14} />
                        </button>
                      )}
                      {r.status !== 'rejected' && (
                        <button
                          className="btn-secondary btn-sm"
                          onClick={() => handleModerate(r.id, 'rejected', false)}
                          title="Reject Review"
                          style={{ color: '#EF4444' }}
                        >
                          <X size={14} />
                        </button>
                      )}
                      <button className="btn-danger btn-sm" onClick={() => handleDelete(r.id)} title="Delete Review">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Photo Viewer Modal */}
      {activePhoto && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div onClick={() => setActivePhoto(null)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)' }} />

          <div style={{ position: 'relative', maxWidth: '700px', maxHeight: '85vh', zIndex: 610, borderRadius: 'var(--radius-md)', overflow: 'hidden', background: '#000' }}>
            <img src={activePhoto} alt="Customer Verification" style={{ width: '100%', height: 'auto', maxHeight: '80vh', objectFit: 'contain', display: 'block' }} />
            <button
              onClick={() => setActivePhoto(null)}
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(0,0,0,0.6)', color: '#fff', padding: '0.4rem', borderRadius: '50%' }}
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
