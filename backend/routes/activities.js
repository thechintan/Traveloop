const express = require('express');
const db = require('../db/database');
const router = express.Router();

// Search activities
router.get('/', (req, res) => {
  const { q, city_id, category, max_cost } = req.query;
  let query = 'SELECT a.*, c.name as city_name FROM activities a JOIN cities c ON a.city_id = c.id WHERE 1=1';
  const params = [];
  if (q) { query += ' AND (a.name LIKE ? OR a.description LIKE ?)'; params.push(`%${q}%`, `%${q}%`); }
  if (city_id) { query += ' AND a.city_id = ?'; params.push(city_id); }
  if (category) { query += ' AND a.category = ?'; params.push(category); }
  if (max_cost) { query += ' AND a.estimated_cost <= ?'; params.push(max_cost); }
  query += ' ORDER BY a.rating DESC';
  res.json(db.prepare(query).all(...params));
});

// Get categories
router.get('/meta/categories', (req, res) => {
  const cats = db.prepare('SELECT DISTINCT category FROM activities WHERE category IS NOT NULL ORDER BY category').all();
  res.json(cats.map(c => c.category));
});

module.exports = router;
