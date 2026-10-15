// Express.js Server
// Serves decoupled static frontend and provides backend foundation
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend static files from /public
app.use(express.static(path.join(__dirname, 'public')));

// Basic health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    phase: 'Phase 1: Frontend Review Iteration',
    database: 'SQLite3 (Scheduled for Phase 2 backend iteration)',
    timestamp: new Date().toISOString()
  });
});

// Fallback to index.html for SPA-like client routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`  ATELIER Apparel Boutique is live on http://localhost:${PORT}`);
  console.log(`  Frontend Iteration: Ready for review`);
  console.log(`  Backend Iteration: Express + SQLite3 + Uploads ready to wire`);
  console.log(`======================================================\n`);
});
