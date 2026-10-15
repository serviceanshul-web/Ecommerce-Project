// Express Products API Routes
const express = require('express');
const router = express.Router();
const db = require('../db/database');

// Helper to format SQLite row into frontend product model
function formatProduct(row) {
  if (!row) return null;
  return {
    id: row.id,
    sku: row.sku,
    name: row.name,
    tagline: row.tagline,
    price: row.price,
    originalPrice: row.original_price,
    rating: row.rating,
    reviewCount: row.review_count,
    category: row.category,
    tags: safeJsonParse(row.tags, []),
    description: row.description,
    details: safeJsonParse(row.details, []),
    composition: row.composition,
    careInstructions: safeJsonParse(row.care_instructions, []),
    images: safeJsonParse(row.images, { front: "", model: "", gallery: [] }),
    colors: safeJsonParse(row.colors, []),
    sizes: safeJsonParse(row.sizes, []),
    createdAt: row.created_at
  };
}

function safeJsonParse(val, fallback) {
  if (!val) return fallback;
  try {
    return JSON.parse(val);
  } catch (e) {
    return fallback;
  }
}

/**
 * GET /api/products
 * Query Params: category, search, maxPrice, inStock, sort
 */
router.get('/', async (req, res) => {
  try {
    const { category, search, maxPrice, sort } = req.query;

    let sql = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (category && category !== 'All') {
      sql += ' AND LOWER(category) = LOWER(?)';
      params.push(category);
    }

    if (maxPrice) {
      sql += ' AND price <= ?';
      params.push(Number(maxPrice));
    }

    if (search && search.trim() !== '') {
      sql += ' AND (LOWER(name) LIKE ? OR LOWER(tagline) LIKE ? OR LOWER(description) LIKE ? OR LOWER(category) LIKE ?)';
      const term = `%${search.trim().toLowerCase()}%`;
      params.push(term, term, term, term);
    }

    // Sort order
    switch (sort) {
      case 'price-asc':
        sql += ' ORDER BY price ASC';
        break;
      case 'price-desc':
        sql += ' ORDER BY price DESC';
        break;
      case 'rating':
        sql += ' ORDER BY rating DESC';
        break;
      case 'featured':
      default:
        sql += ' ORDER BY created_at DESC';
        break;
    }

    const rows = await db.allAsync(sql, params);
    const products = rows.map(formatProduct);
    res.json(products);
  } catch (err) {
    console.error('Error in GET /api/products:', err);
    res.status(500).json({ error: 'Failed to retrieve products' });
  }
});

/**
 * GET /api/products/:id
 */
router.get('/:id', async (req, res) => {
  try {
    const row = await db.getAsync('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (!row) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(formatProduct(row));
  } catch (err) {
    console.error('Error in GET /api/products/:id:', err);
    res.status(500).json({ error: 'Failed to retrieve product' });
  }
});

/**
 * POST /api/products
 * Add new product to catalog
 */
router.post('/', async (req, res) => {
  try {
    const p = req.body;
    const id = p.id || 'prod-' + Math.random().toString(36).substring(2, 8);
    const sku = p.sku || 'ATL-' + Math.random().toString(36).substring(2, 6).toUpperCase();

    await db.runAsync(`
      INSERT INTO products (
        id, sku, name, tagline, price, original_price, rating, review_count,
        category, tags, description, details, composition, care_instructions,
        images, colors, sizes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id,
      sku,
      p.name || 'Untitled Garment',
      p.tagline || '',
      p.price || 0,
      p.originalPrice || null,
      p.rating || 5.0,
      p.reviewCount || 0,
      p.category || 'Tops',
      JSON.stringify(p.tags || []),
      p.description || '',
      JSON.stringify(p.details || []),
      p.composition || '',
      JSON.stringify(p.careInstructions || []),
      JSON.stringify(p.images || { front: '', model: '', gallery: [] }),
      JSON.stringify(p.colors || []),
      JSON.stringify(p.sizes || [])
    ]);

    const created = await db.getAsync('SELECT * FROM products WHERE id = ?', [id]);
    res.status(201).json(formatProduct(created));
  } catch (err) {
    console.error('Error in POST /api/products:', err);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

/**
 * DELETE /api/products/:id
 */
router.delete('/:id', async (req, res) => {
  try {
    await db.runAsync('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    console.error('Error in DELETE /api/products/:id:', err);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;
