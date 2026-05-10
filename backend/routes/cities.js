const express = require('express');
const db = require('../db/database');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

// Search cities
router.get('/', (req, res) => {
  const { q, region, country } = req.query;
  let query = 'SELECT * FROM cities WHERE 1=1';
  const params = [];
  if (q) { query += ' AND (name LIKE ? OR country LIKE ?)'; params.push(`%${q}%`, `%${q}%`); }
  if (region) { query += ' AND region = ?'; params.push(region); }
  if (country) { query += ' AND country = ?'; params.push(country); }
  query += ' ORDER BY popularity DESC';
  res.json(db.prepare(query).all(...params));
});

// Get single city
router.get('/:id', (req, res) => {
  const city = db.prepare('SELECT * FROM cities WHERE id = ?').get(req.params.id);
  if (!city) return res.status(404).json({ error: 'City not found' });
  city.activities = db.prepare('SELECT * FROM activities WHERE city_id = ?').all(city.id);
  res.json(city);
});

// Get regions
router.get('/meta/regions', (req, res) => {
  const regions = db.prepare('SELECT DISTINCT region FROM cities WHERE region IS NOT NULL ORDER BY region').all();
  res.json(regions.map(r => r.region));
});

module.exports = router;
