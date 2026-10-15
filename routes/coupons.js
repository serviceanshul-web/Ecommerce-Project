// Express Promo Coupons API Routes
const express = require('express');
const router = express.Router();
const db = require('../db/database');

/**
 * POST /api/coupons/validate
 * Check coupon validity and return discount rate
 */
router.post('/validate', async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, message: 'Coupon code required' });
    }

    const cleanCode = code.trim().toUpperCase();
    const row = await db.getAsync('SELECT * FROM coupons WHERE code = ? AND is_active = 1', [cleanCode]);

    if (!row) {
      return res.json({ success: false, message: 'Invalid or expired promo code.' });
    }

    res.json({
      success: true,
      coupon: {
        code: row.code,
        discountPercent: row.discount_percent,
        description: row.description
      }
    });
  } catch (err) {
    console.error('Error validating coupon:', err);
    res.status(500).json({ success: false, message: 'Error checking coupon' });
  }
});

/**
 * GET /api/coupons
 * List public promotions
 */
router.get('/', async (req, res) => {
  try {
    const rows = await db.allAsync('SELECT code, discount_percent, description FROM coupons WHERE is_active = 1');
    res.json(rows.map(r => ({
      code: r.code,
      discountPercent: r.discount_percent,
      description: r.description
    })));
  } catch (err) {
    console.error('Error in GET /api/coupons:', err);
    res.status(500).json({ error: 'Failed to retrieve coupons' });
  }
});

module.exports = router;
