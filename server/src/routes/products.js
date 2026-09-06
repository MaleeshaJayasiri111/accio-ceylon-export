const express = require('express');
const router = express.Router();
const { db } = require('../db/database');
const { requireAdmin } = require('../middleware/auth');

function formatProduct(p) {
  if (!p) return null;
  return {
    ...p,
    packaging_types: typeof p.packaging_types === 'string' ? JSON.parse(p.packaging_types || '[]') : p.packaging_types,
    certifications: typeof p.certifications === 'string' ? JSON.parse(p.certifications || '[]') : p.certifications,
    nutrition_facts: typeof p.nutrition_facts === 'string' ? JSON.parse(p.nutrition_facts || '{}') : p.nutrition_facts,
    images: typeof p.images === 'string' ? JSON.parse(p.images || '[]') : p.images,
    in_stock: Boolean(p.in_stock),
    is_featured: Boolean(p.is_featured)
  };
}

// Get all products
router.get('/', (req, res) => {
  try {
    const { category, search, featured, in_stock } = req.query;
    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (category && category !== 'All') {
      query += ' AND category = ?';
      params.push(category);
    }

    if (featured === 'true' || featured === '1') {
      query += ' AND is_featured = 1';
    }

    if (in_stock === 'true' || in_stock === '1') {
      query += ' AND in_stock = 1';
    }

    if (search) {
      query += ' AND (name LIKE ? OR description LIKE ? OR origin_region LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY is_featured DESC, created_at DESC';

    const products = db.prepare(query).all(...params).map(formatProduct);
    res.json({ products });
  } catch (err) {
    console.error('Fetch products error:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get single product by ID or Slug
router.get('/:idOrSlug', (req, res) => {
  try {
    const { idOrSlug } = req.params;
    const product = db.prepare(`
      SELECT * FROM products WHERE id = ? OR slug = ?
    `).get(idOrSlug, idOrSlug);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Also get verified reviews for this product
    const reviews = db.prepare(`
      SELECT * FROM reviews WHERE product_id = ? AND status = 'approved' ORDER BY is_featured DESC, created_at DESC
    `).all(product.id).map(r => ({
      ...r,
      photo_urls: typeof r.photo_urls === 'string' ? JSON.parse(r.photo_urls || '[]') : r.photo_urls,
      is_verified: Boolean(r.is_verified),
      is_featured: Boolean(r.is_featured)
    }));

    res.json({
      product: formatProduct(product),
      reviews
    });
  } catch (err) {
    console.error('Fetch single product error:', err);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Admin: Create product
router.post('/', requireAdmin, (req, res) => {
  try {
    const {
      name, slug, category, description, short_desc, moisture_level,
      shelf_life, packaging_types, fob_price_usd, moq_kg, origin_region,
      certifications, nutrition_facts, images, in_stock, is_featured
    } = req.body;

    if (!name || !category || !description || fob_price_usd === undefined) {
      return res.status(400).json({ error: 'Name, category, description and FOB price are required.' });
    }

    const id = 'prod_' + Date.now();
    const productSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    db.prepare(`
      INSERT INTO products (
        id, name, slug, category, description, short_desc, moisture_level,
        shelf_life, packaging_types, fob_price_usd, moq_kg, origin_region,
        certifications, nutrition_facts, images, in_stock, is_featured
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      )
    `).run(
      id,
      name,
      productSlug,
      category,
      description,
      short_desc || '',
      moisture_level || '< 10%',
      shelf_life || '24 Months',
      typeof packaging_types === 'string' ? packaging_types : JSON.stringify(packaging_types || []),
      parseFloat(fob_price_usd),
      parseFloat(moq_kg || 20),
      origin_region || 'Sri Lanka',
      typeof certifications === 'string' ? certifications : JSON.stringify(certifications || []),
      typeof nutrition_facts === 'string' ? nutrition_facts : JSON.stringify(nutrition_facts || {}),
      typeof images === 'string' ? images : JSON.stringify(images || []),
      in_stock !== undefined ? (in_stock ? 1 : 0) : 1,
      is_featured ? 1 : 0
    );

    const created = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    res.status(201).json({ product: formatProduct(created) });
  } catch (err) {
    console.error('Create product error:', err);
    res.status(500).json({ error: 'Failed to create product: ' + err.message });
  }
});

// Admin: Update product
router.put('/:id', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const {
      name, slug, category, description, short_desc, moisture_level,
      shelf_life, packaging_types, fob_price_usd, moq_kg, origin_region,
      certifications, nutrition_facts, images, in_stock, is_featured
    } = req.body;

    db.prepare(`
      UPDATE products SET
        name = COALESCE(?, name),
        slug = COALESCE(?, slug),
        category = COALESCE(?, category),
        description = COALESCE(?, description),
        short_desc = COALESCE(?, short_desc),
        moisture_level = COALESCE(?, moisture_level),
        shelf_life = COALESCE(?, shelf_life),
        packaging_types = COALESCE(?, packaging_types),
        fob_price_usd = COALESCE(?, fob_price_usd),
        moq_kg = COALESCE(?, moq_kg),
        origin_region = COALESCE(?, origin_region),
        certifications = COALESCE(?, certifications),
        nutrition_facts = COALESCE(?, nutrition_facts),
        images = COALESCE(?, images),
        in_stock = COALESCE(?, in_stock),
        is_featured = COALESCE(?, is_featured)
      WHERE id = ?
    `).run(
      name,
      slug,
      category,
      description,
      short_desc,
      moisture_level,
      shelf_life,
      packaging_types ? (typeof packaging_types === 'string' ? packaging_types : JSON.stringify(packaging_types)) : null,
      fob_price_usd !== undefined ? parseFloat(fob_price_usd) : null,
      moq_kg !== undefined ? parseFloat(moq_kg) : null,
      origin_region,
      certifications ? (typeof certifications === 'string' ? certifications : JSON.stringify(certifications)) : null,
      nutrition_facts ? (typeof nutrition_facts === 'string' ? nutrition_facts : JSON.stringify(nutrition_facts)) : null,
      images ? (typeof images === 'string' ? images : JSON.stringify(images)) : null,
      in_stock !== undefined ? (in_stock ? 1 : 0) : null,
      is_featured !== undefined ? (is_featured ? 1 : 0) : null,
      id
    );

    const updated = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    res.json({ product: formatProduct(updated) });
  } catch (err) {
    console.error('Update product error:', err);
    res.status(500).json({ error: 'Failed to update product: ' + err.message });
  }
});

// Admin: Delete product
router.delete('/:id', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM products WHERE id = ?').run(id);
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Delete product error:', err);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;
