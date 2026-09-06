import React, { useState } from 'react';
import { X, Star, Upload, Image, CheckCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ReviewModal({ isOpen, onClose, products = [], onReviewSubmitted }) {
  const { user } = useAuth();
  const [productId, setProductId] = useState(products[0]?.id || 'prod_mango_01');
  const [authorName, setAuthorName] = useState(user ? user.full_name : '');
  const [authorCountry, setAuthorCountry] = useState(user ? user.country : 'United Kingdom');
  const [authorCompany, setAuthorCompany] = useState(user ? user.company_name : '');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [photoUrls, setPhotoUrls] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      setPhotoUrls((prev) => [...prev, data.url]);
    } catch (err) {
      setError('Photo upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(user ? { Authorization: `Bearer ${localStorage.getItem('accio_customer_token')}` } : {})
        },
        body: JSON.stringify({
          product_id: productId,
          author_name: authorName,
          author_country: authorCountry,
          author_company: authorCompany,
          rating,
          title,
          comment,
          photo_urls: photoUrls
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit review');

      if (onReviewSubmitted) onReviewSubmitted(data.review);
      onClose();
    } catch (err) {
      setError(err.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0, 0, 0, 0.65)', backdropFilter: 'blur(5px)' }} />

      <div
        className="glass-panel"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '520px',
          borderRadius: 'var(--radius-lg)',
          background: 'var(--bg-surface)',
          padding: '2rem',
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--border-subtle)',
          zIndex: 510,
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        <button onClick={onClose} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', color: 'var(--text-muted)' }}>
          <X size={20} />
        </button>

        <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.3rem' }}>
          Share Your Export & Product Feedback
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          Help international buyers assess Ceylon dehydrated fruit quality, aroma, and packaging standards.
        </p>

        {error && (
          <div style={{ padding: '0.65rem 0.9rem', borderRadius: 'var(--radius-sm)', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid #EF4444', color: '#DC2626', fontSize: '0.85rem', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.3rem' }}>Select Ceylon Product *</label>
            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              style={{ width: '100%', padding: '0.65rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface-elevated)', color: 'var(--text-primary)' }}
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.3rem' }}>Your Rating *</label>
            <div style={{ display: 'flex', gap: '0.35rem' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  style={{ padding: '0.2rem' }}
                >
                  <Star
                    size={26}
                    fill={(hoverRating || rating) >= star ? '#F59E0B' : 'none'}
                    color={(hoverRating || rating) >= star ? '#F59E0B' : 'var(--border-subtle)'}
                  />
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.3rem' }}>Your Name *</label>
              <input
                type="text"
                required
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="e.g. Oliver Wright"
                style={{ width: '100%', padding: '0.65rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface-elevated)', color: 'var(--text-primary)' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.3rem' }}>Country *</label>
              <input
                type="text"
                required
                value={authorCountry}
                onChange={(e) => setAuthorCountry(e.target.value)}
                placeholder="e.g. United Kingdom"
                style={{ width: '100%', padding: '0.65rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface-elevated)', color: 'var(--text-primary)' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.3rem' }}>Company Name (Optional)</label>
            <input
              type="text"
              value={authorCompany}
              onChange={(e) => setAuthorCompany(e.target.value)}
              placeholder="e.g. London Organics Snack Co."
              style={{ width: '100%', padding: '0.65rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface-elevated)', color: 'var(--text-primary)' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.3rem' }}>Review Headline</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Outstanding mango slice texture & pristine pouches"
              style={{ width: '100%', padding: '0.65rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface-elevated)', color: 'var(--text-primary)' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.3rem' }}>Review Details *</label>
            <textarea
              required
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Describe product freshness, packaging seal, moisture levels, or export shipping speed..."
              style={{ width: '100%', padding: '0.65rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface-elevated)', color: 'var(--text-primary)', resize: 'vertical' }}
            />
          </div>

          {/* Photo Attachment */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.3rem' }}>
              Upload Packaging / Product Photos
            </label>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <label
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.5rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px dashed var(--primary)',
                  color: 'var(--primary)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <Upload size={15} />
                <span>{uploading ? 'Uploading...' : 'Choose Photo'}</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} disabled={uploading} />
              </label>

              {photoUrls.map((url, idx) => (
                <div key={idx} style={{ position: 'relative', width: '50px', height: '50px', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
                  <img src={url} alt="Uploaded preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button
                    type="button"
                    onClick={() => setPhotoUrls(photoUrls.filter((_, i) => i !== idx))}
                    style={{ position: 'absolute', top: 0, right: 0, background: 'rgba(0,0,0,0.6)', color: '#fff', padding: '1px 4px', fontSize: '9px' }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting || uploading}
            style={{ width: '100%', marginTop: '0.5rem', padding: '0.8rem' }}
          >
            {submitting ? 'Submitting Review...' : 'Publish Verified Review'}
            <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
