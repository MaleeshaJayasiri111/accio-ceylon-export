import React, { useState, useEffect } from 'react';
import { Star, CheckCircle2, Filter, Upload, Image, Sparkles, Building, Globe } from 'lucide-react';
import { INITIAL_REVIEWS } from '../data/initialData';

export default function ReviewsPage({ onOpenReviewModal }) {
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [loading, setLoading] = useState(false);
  const [countryFilter, setCountryFilter] = useState('All');
  const [ratingFilter, setRatingFilter] = useState(0);

  useEffect(() => {
    let url = '/api/reviews';
    const params = new URLSearchParams();
    if (countryFilter !== 'All') params.append('country', countryFilter);
    if (ratingFilter > 0) params.append('rating', ratingFilter);
    if (params.toString()) url += `?${params.toString()}`;

    fetch(url)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.reviews && data.reviews.length > 0) {
          setReviews(data.reviews);
        } else {
          let filtered = INITIAL_REVIEWS;
          if (countryFilter !== 'All') {
            filtered = filtered.filter((r) => r.customer_country === countryFilter);
          }
          if (ratingFilter > 0) {
            filtered = filtered.filter((r) => r.rating === ratingFilter);
          }
          setReviews(filtered);
        }
      })
      .catch(() => {
        let filtered = INITIAL_REVIEWS;
        if (countryFilter !== 'All') {
          filtered = filtered.filter((r) => r.customer_country === countryFilter);
        }
        if (ratingFilter > 0) {
          filtered = filtered.filter((r) => r.rating === ratingFilter);
        }
        setReviews(filtered);
      });
  }, [countryFilter, ratingFilter]);

  const countries = ['All', 'United Kingdom', 'Australia', 'Germany', 'United Arab Emirates', 'Ireland'];

  return (
    <div style={{ padding: '3.5rem 0 6rem' }}>
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 3rem' }}>
          <span className="badge badge-green" style={{ marginBottom: '0.5rem' }}>Global Export Verification</span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.75rem' }}>
            International Importer Reviews & Packaging Gallery
          </h1>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
            Real unedited photos and quality assessments from retail distributors, organic snack brands, and supermarket buyers worldwide.
          </p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '3rem', padding: '1rem 1.5rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>Country:</span>
              {countries.map((c) => (
                <button
                  key={c}
                  onClick={() => setCountryFilter(c)}
                  style={{
                    padding: '0.35rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    background: countryFilter === c ? 'var(--primary)' : 'var(--bg-surface)',
                    color: countryFilter === c ? '#FFFFFF' : 'var(--text-primary)',
                    border: countryFilter === c ? 'none' : '1px solid var(--border-subtle)'
                  }}
                >
                  {c}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>Min Stars:</span>
              {[0, 4, 5].map((stars) => (
                <button
                  key={stars}
                  onClick={() => setRatingFilter(stars)}
                  style={{
                    padding: '0.35rem 0.65rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    background: ratingFilter === stars ? 'var(--primary)' : 'var(--bg-surface)',
                    color: ratingFilter === stars ? '#FFFFFF' : 'var(--text-primary)',
                    border: ratingFilter === stars ? 'none' : '1px solid var(--border-subtle)'
                  }}
                >
                  {stars === 0 ? 'All' : `${stars}★ & above`}
                </button>
              ))}
            </div>
          </div>

          <button className="btn btn-primary" onClick={onOpenReviewModal}>
            <span>Submit Your Review</span>
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
            Loading verified reviews...
          </div>
        ) : reviews.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
            No reviews match your selected filter.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
            {reviews.map((r) => (
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
                {r.photo_urls && r.photo_urls.length > 0 && (
                  <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', height: '240px', marginBottom: '1.25rem', border: '1px solid var(--border-subtle)', background: '#000' }}>
                    <img
                      src={r.photo_urls[0]}
                      alt="Customer packaging verification photo"
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      onError={(e) => { e.target.src = '/reviews/review_mango_hand.jpg'; }}
                    />
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', gap: '0.2rem', color: '#F59E0B' }}>
                    {[...Array(r.rating)].map((_, i) => (
                      <Star key={i} size={17} fill="#F59E0B" color="#F59E0B" />
                    ))}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {r.created_at ? new Date(r.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', lineHeight: 1.3 }}>
                  "{r.title || 'Verified Importer Assessment'}"
                </h3>

                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem', flex: 1 }}>
                  {r.comment}
                </p>

                {r.product_name && (
                  <div style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 600, marginBottom: '0.75rem' }}>
                    Harvest: {r.product_name}
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--botanical))', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem' }}>
                    {r.author_name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span>{r.author_name}</span>
                      <CheckCircle2 size={15} color="#10B981" />
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {r.author_company ? `${r.author_company} • ` : ''}{r.author_country}
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