const express = require('express');
const db = require('../db/database');
const { optionalAuth } = require('../middleware/auth');
const router = express.Router();

// Get shared trip by share code
router.get('/:code', optionalAuth, (req, res) => {
  const trip = db.prepare('SELECT t.*, u.name as author_name FROM trips t JOIN users u ON t.user_id = u.id WHERE t.share_code = ? AND t.is_public = 1').get(req.params.code);
  if (!trip) return res.status(404).json({ error: 'Trip not found or not public' });
  const stops = db.prepare(`
    SELECT ts.*, c.name as city_name, c.country, c.image_url as city_image
    FROM trip_stops ts JOIN cities c ON ts.city_id = c.id WHERE ts.trip_id = ? ORDER BY ts.sort_order
  `).all(trip.id);
  stops.forEach(stop => {
    stop.activities = db.prepare(`
      SELECT sa.*, a.name, a.description, a.category, a.estimated_cost, a.duration_hours
      FROM stop_activities sa JOIN activities a ON sa.activity_id = a.id WHERE sa.stop_id = ?
    `).all(stop.id);
  });
  res.json({ ...trip, stops });
});

// Copy shared trip to user
router.post('/:code/copy', optionalAuth, (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Login required to copy trips' });
  const trip = db.prepare('SELECT * FROM trips WHERE share_code = ? AND is_public = 1').get(req.params.code);
  if (!trip) return res.status(404).json({ error: 'Trip not found' });
  const { v4: uuidv4 } = require('uuid');
  const newCode = uuidv4().slice(0, 8);
  const result = db.prepare('INSERT INTO trips (user_id, name, description, start_date, end_date, share_code) VALUES (?,?,?,?,?,?)')
    .run(req.user.id, trip.name + ' (Copy)', trip.description, trip.start_date, trip.end_date, newCode);
  const stops = db.prepare('SELECT * FROM trip_stops WHERE trip_id = ? ORDER BY sort_order').all(trip.id);
  stops.forEach(stop => {
    const sr = db.prepare('INSERT INTO trip_stops (trip_id, city_id, arrival_date, departure_date, sort_order, transport_mode, transport_cost, accommodation_cost) VALUES (?,?,?,?,?,?,?,?)')
      .run(result.lastInsertRowid, stop.city_id, stop.arrival_date, stop.departure_date, stop.sort_order, stop.transport_mode, stop.transport_cost, stop.accommodation_cost);
    const acts = db.prepare('SELECT * FROM stop_activities WHERE stop_id = ?').all(stop.id);
    acts.forEach(a => {
      db.prepare('INSERT INTO stop_activities (stop_id, activity_id, scheduled_date, scheduled_time, notes) VALUES (?,?,?,?,?)')
        .run(sr.lastInsertRowid, a.activity_id, a.scheduled_date, a.scheduled_time, a.notes);
    });
  });
  res.status(201).json({ id: result.lastInsertRowid, message: 'Trip copied!' });
});

module.exports = router;
