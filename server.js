// Express.js Decoupled E-Commerce Backend Server
// Provides REST APIs, SQLite3 Database Engine, Local File Uploads, and Static Frontend Serving
const express = require('express');
const path = require('path');
const fs = require('fs');

// Initialize database
const db = require('./db/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Ensure local uploads directory exists (use /tmp on Vercel serverless)
const UPLOADS_DIR = process.env.VERCEL ? path.join('/tmp', 'uploads') : path.join(__dirname, 'uploads');
try {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
} catch (e) {
  console.warn('Upload directory initialization warning:', e.message);
}

// Serve uploaded assets statically from the local folder
app.use('/uploads', express.static(UPLOADS_DIR));

// Serve decoupled frontend static assets
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/coupons', require('./routes/coupons'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/profile', require('./routes/profile'));

// System Health & Architecture Status Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    phase: 'Backend & Frontend Connected',
    database: 'SQLite3 (Active)',
    uploadFolder: process.env.VERCEL ? 'serverless (/tmp/uploads)' : 'local (./uploads)',
    isVercel: !!process.env.VERCEL,
    timestamp: new Date().toISOString()
  });
});

// Client SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Central Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err.stack);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

// Start local listener if executed directly
if (require.main === module || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`  ATELIER E-Commerce Platform is Live`);
    console.log(`  URL: http://localhost:${PORT}`);
    console.log(`  Database: SQLite3 (db/ecommerce.db)`);
    console.log(`  Local Uploads: ./uploads`);
    console.log(`  APIs: /api/products, /api/orders, /api/coupons, /api/upload, /api/profile`);
    console.log(`======================================================\n`);
  });
}

module.exports = app;
