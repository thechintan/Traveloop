const express = require('express');
const db = require('../db/database');
const { authMiddleware } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Get all trips for user
router.get('/', authMiddleware, (req, res) => {
  const trips = db.prepare(`
    SELECT t.*, (SELECT COUNT(*) FROM trip_stops WHERE trip_id = t.id) as stop_count
    FROM trips t WHERE t.user_id = ? ORDER BY t.created_at DESC
  `).all(req.user.id);
  res.json(trips);
});

// Get single trip
router.get('/:id', authMiddleware, (req, res) => {
  const trip = db.prepare(`SELECT * FROM trips WHERE id = ? AND user_id = ?`).get(req.params.id, req.user.id);
  if (!trip) return res.status(404).json({ error: 'Trip not found' });
  const stops = db.prepare(`
    SELECT ts.*, c.name as city_name, c.country, c.image_url as city_image
    FROM trip_stops ts JOIN cities c ON ts.city_id = c.id
    WHERE ts.trip_id = ? ORDER BY ts.sort_order
  `).all(trip.id);
  stops.forEach(stop => {
    stop.activities = db.prepare(`
      SELECT sa.*, a.name, a.description, a.category, a.estimated_cost, a.duration_hours, a.image_url
      FROM stop_activities sa JOIN activities a ON sa.activity_id = a.id
      WHERE sa.stop_id = ?
    `).all(stop.id);
  });
  res.json({ ...trip, stops });
});

// Create trip
router.post('/', authMiddleware, (req, res) => {
  const { name, description, start_date, end_date, cover_image } = req.body;
  if (!name) return res.status(400).json({ error: 'Trip name is required' });
  const shareCode = uuidv4().slice(0, 8);
  const result = db.prepare(
    'INSERT INTO trips (user_id, name, description, start_date, end_date, cover_image, share_code) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).run(req.user.id, name, description, start_date, end_date, cover_image, shareCode);
  const trip = db.prepare('SELECT * FROM trips WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(trip);
});

// Update trip
router.put('/:id', authMiddleware, (req, res) => {
  const { name, description, start_date, end_date, cover_image, is_public } = req.body;
  const trip = db.prepare('SELECT * FROM trips WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
  if (!trip) return res.status(404).json({ error: 'Trip not found' });
  db.prepare(`UPDATE trips SET name=COALESCE(?,name), description=COALESCE(?,description), start_date=COALESCE(?,start_date), end_date=COALESCE(?,end_date), cover_image=COALESCE(?,cover_image), is_public=COALESCE(?,is_public) WHERE id=?`)
    .run(name, description, start_date, end_date, cover_image, is_public, req.params.id);
  res.json(db.prepare('SELECT * FROM trips WHERE id = ?').get(req.params.id));
});

// Delete trip
router.delete('/:id', authMiddleware, (req, res) => {
  const trip = db.prepare('SELECT * FROM trips WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
  if (!trip) return res.status(404).json({ error: 'Trip not found' });
  db.prepare('DELETE FROM trips WHERE id = ?').run(req.params.id);
  res.json({ message: 'Trip deleted' });
});

module.exports = router;
