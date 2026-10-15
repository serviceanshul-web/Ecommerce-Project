// Express User Profile API Routes
const express = require('express');
const router = express.Router();
const db = require('../db/database');

function safeJsonParse(val, fallback) {
  if (!val) return fallback;
  try {
    return JSON.parse(val);
  } catch (e) {
    return fallback;
  }
}

/**
 * GET /api/profile
 */
router.get('/', async (req, res) => {
  try {
    const row = await db.getAsync('SELECT * FROM profiles WHERE id = ?', ['default-user']);
    if (!row) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json({
      id: row.id,
      fullName: row.full_name,
      email: row.email,
      phone: row.phone,
      tier: row.tier,
      memberSince: row.member_since,
      avatar: row.avatar,
      addresses: safeJsonParse(row.addresses, []),
      paymentMethods: safeJsonParse(row.payment_methods, []),
      preferences: safeJsonParse(row.preferences, {})
    });
  } catch (err) {
    console.error('Error in GET /api/profile:', err);
    res.status(500).json({ error: 'Failed to retrieve profile' });
  }
});

/**
 * PUT /api/profile
 */
router.put('/', async (req, res) => {
  try {
    const { fullName, email, phone, addresses, paymentMethods, preferences } = req.body;

    const current = await db.getAsync('SELECT * FROM profiles WHERE id = ?', ['default-user']);
    if (!current) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    await db.runAsync(`
      UPDATE profiles SET
        full_name = COALESCE(?, full_name),
        email = COALESCE(?, email),
        phone = COALESCE(?, phone),
        addresses = COALESCE(?, addresses),
        payment_methods = COALESCE(?, payment_methods),
        preferences = COALESCE(?, preferences),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = 'default-user'
    `, [
      fullName,
      email,
      phone,
      addresses ? JSON.stringify(addresses) : null,
      paymentMethods ? JSON.stringify(paymentMethods) : null,
      preferences ? JSON.stringify(preferences) : null
    ]);

    const updated = await db.getAsync('SELECT * FROM profiles WHERE id = ?', ['default-user']);
    res.json({
      success: true,
      profile: {
        id: updated.id,
        fullName: updated.full_name,
        email: updated.email,
        phone: updated.phone,
        tier: updated.tier,
        memberSince: updated.member_since,
        avatar: updated.avatar,
        addresses: safeJsonParse(updated.addresses, []),
        paymentMethods: safeJsonParse(updated.payment_methods, []),
        preferences: safeJsonParse(updated.preferences, {})
      }
    });
  } catch (err) {
    console.error('Error in PUT /api/profile:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

module.exports = router;
