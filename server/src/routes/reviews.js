const express = require('express');
const router = express.Router();
const { db } = require('../db/database');
const { requireAdmin, optionalToken } = require('../middleware/auth');

function formatReview(r) {
  if (!r) return null;
  return {
    ...r,
    photo_urls: typeof r.photo_urls === 'string' ? JSON.parse(r.photo_urls || '[]') : r.photo_urls,
    is_verified: Boolean(r.is_verified),
    is_featured: Boolean(r.is_featured)
  };
}

// Get approved public reviews
router.get('/', (req, res) => {
  try {
    const { product_id, country, rating, featured } = req.query;
    let query = `
      SELECT r.*, p.name as product_name, p.slug as product_slug, p.images as product_images
      FROM reviews r
      LEFT JOIN products p ON r.product_id = p.id
      WHERE r.status = 'approved'
    `;
    const params = [];

    if (product_id) {
      query += ' AND r.product_id = ?';
      params.push(product_id);
    }

    if (country) {
      query += ' AND r.author_country = ?';
      params.push(country);
    }

    if (rating) {
      query += ' AND r.rating >= ?';
      params.push(parseInt(rating));
    }

    if (featured === 'true' || featured === '1') {
      query += ' AND r.is_featured = 1';
    }

    query += ' ORDER BY r.is_featured DESC, r.created_at DESC';

    const reviews = db.prepare(query).all(...params).map(r => {
      const formatted = formatReview(r);
      if (formatted.product_images) {
        formatted.product_images = typeof formatted.product_images === 'string' ? JSON.parse(formatted.product_images) : formatted.product_images;
      }
      return formatted;
    });

    res.json({ reviews });
  } catch (err) {
    console.error('Fetch reviews error:', err);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// Submit a new review
router.post('/', optionalToken, (req, res) => {
  try {
    const {
      product_id, author_name, author_country, author_company,
      rating, title, comment, photo_urls
    } = req.body;

    if (!author_name || !author_country || !comment || !rating) {
      return res.status(400).json({ error: 'Name, country, rating, and review text are required.' });
    }

    const reviewId = 'rev_' + Date.now();
    const photos = Array.isArray(photo_urls) ? JSON.stringify(photo_urls) : (typeof photo_urls === 'string' ? photo_urls : '[]');

    db.prepare(`
      INSERT INTO reviews (
        id, product_id, author_name, author_country, author_company,
        rating, title, comment, photo_urls, is_verified, is_featured, status, created_at
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 0, 'approved', datetime('now')
      )
    `).run(
      reviewId,
      product_id || null,
      author_name,
      author_country,
      author_company || '',
      parseInt(rating),
      title || '',
      comment,
      photos
    );

    const created = db.prepare('SELECT * FROM reviews WHERE id = ?').get(reviewId);
    res.status(201).json({
      message: 'Review submitted successfully',
      review: formatReview(created)
    });
  } catch (err) {
    console.error('Submit review error:', err);
    res.status(500).json({ error: 'Failed to submit review: ' + err.message });
  }
});

// Admin: Get all reviews (approved, pending, rejected)
router.get('/admin', requireAdmin, (req, res) => {
  try {
    const { status } = req.query;
    let query = `
      SELECT r.*, p.name as product_name
      FROM reviews r
      LEFT JOIN products p ON r.product_id = p.id
    `;
    const params = [];

    if (status && status !== 'All') {
      query += ' WHERE r.status = ?';
      params.push(status);
    }

    query += ' ORDER BY r.created_at DESC';

    const reviews = db.prepare(query).all(...params).map(formatReview);
    res.json({ reviews });
  } catch (err) {
    console.error('Fetch admin reviews error:', err);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// Admin: Moderate review status
router.patch('/:id/status', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const { status, is_featured } = req.body;

    const existing = db.prepare('SELECT * FROM reviews WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Review not found' });
    }

    db.prepare(`
      UPDATE reviews SET
        status = COALESCE(?, status),
        is_featured = COALESCE(?, is_featured)
      WHERE id = ?
    `).run(
      status,
      is_featured !== undefined ? (is_featured ? 1 : 0) : null,
      id
    );

    const updated = db.prepare('SELECT * FROM reviews WHERE id = ?').get(id);
    res.json({ review: formatReview(updated) });
  } catch (err) {
    console.error('Moderate review error:', err);
    res.status(500).json({ error: 'Failed to update review status' });
  }
});

// Admin: Delete review
router.delete('/:id', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM reviews WHERE id = ?').run(id);
    res.json({ success: true, message: 'Review deleted successfully' });
  } catch (err) {
    console.error('Delete review error:', err);
    res.status(500).json({ error: 'Failed to delete review' });
  }
});

module.exports = router;
