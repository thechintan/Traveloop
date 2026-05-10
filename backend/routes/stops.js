const express = require('express');
const db = require('../db/database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Get stops for a trip
router.get('/trip/:tripId', authMiddleware, (req, res) => {
  const stops = db.prepare(`
    SELECT ts.*, c.name as city_name, c.country, c.image_url as city_image, c.cost_index
    FROM trip_stops ts JOIN cities c ON ts.city_id = c.id
    WHERE ts.trip_id = ? ORDER BY ts.sort_order
  `).all(req.params.tripId);
  stops.forEach(stop => {
    stop.activities = db.prepare(`
      SELECT sa.*, a.name, a.description, a.category, a.estimated_cost, a.duration_hours
      FROM stop_activities sa JOIN activities a ON sa.activity_id = a.id WHERE sa.stop_id = ?
    `).all(stop.id);
  });
  res.json(stops);
});

// Add stop
router.post('/', authMiddleware, (req, res) => {
  const { trip_id, city_id, arrival_date, departure_date, transport_mode, transport_cost, accommodation_cost } = req.body;
  const maxOrder = db.prepare('SELECT MAX(sort_order) as max_order FROM trip_stops WHERE trip_id = ?').get(trip_id);
  const sortOrder = (maxOrder?.max_order || 0) + 1;
  const result = db.prepare(
    'INSERT INTO trip_stops (trip_id, city_id, arrival_date, departure_date, sort_order, transport_mode, transport_cost, accommodation_cost) VALUES (?,?,?,?,?,?,?,?)'
  ).run(trip_id, city_id, arrival_date || null, departure_date || null, sortOrder, transport_mode || null, transport_cost || 0, accommodation_cost || 0);
  const stop = db.prepare(`SELECT ts.*, c.name as city_name, c.country, c.image_url as city_image FROM trip_stops ts JOIN cities c ON ts.city_id = c.id WHERE ts.id = ?`).get(result.lastInsertRowid);
  stop.activities = [];
  res.status(201).json(stop);
});

// Update stop
router.put('/:id', authMiddleware, (req, res) => {
  const { arrival_date, departure_date, transport_mode, transport_cost, accommodation_cost, sort_order } = req.body;
  db.prepare(`UPDATE trip_stops SET arrival_date=COALESCE(?,arrival_date), departure_date=COALESCE(?,departure_date), transport_mode=COALESCE(?,transport_mode), transport_cost=COALESCE(?,transport_cost), accommodation_cost=COALESCE(?,accommodation_cost), sort_order=COALESCE(?,sort_order) WHERE id=?`)
    .run(arrival_date || null, departure_date || null, transport_mode || null, transport_cost ?? null, accommodation_cost ?? null, sort_order ?? null, req.params.id);
  res.json({ message: 'Stop updated' });
});

// Delete stop
router.delete('/:id', authMiddleware, (req, res) => {
  db.prepare('DELETE FROM trip_stops WHERE id = ?').run(req.params.id);
  res.json({ message: 'Stop deleted' });
});

// Add activity to stop
router.post('/:stopId/activities', authMiddleware, (req, res) => {
  const { activity_id, scheduled_date, scheduled_time, notes } = req.body;
  const result = db.prepare(
    'INSERT INTO stop_activities (stop_id, activity_id, scheduled_date, scheduled_time, notes) VALUES (?,?,?,?,?)'
  ).run(req.params.stopId, activity_id, scheduled_date || null, scheduled_time || null, notes || null);
  const sa = db.prepare(`
    SELECT sa.*, a.name, a.description, a.category, a.estimated_cost, a.duration_hours
    FROM stop_activities sa JOIN activities a ON sa.activity_id = a.id WHERE sa.id = ?
  `).get(result.lastInsertRowid);
  res.status(201).json(sa);
});

// Remove activity from stop
router.delete('/:stopId/activities/:activityId', authMiddleware, (req, res) => {
  db.prepare('DELETE FROM stop_activities WHERE id = ? AND stop_id = ?').run(req.params.activityId, req.params.stopId);
  res.json({ message: 'Activity removed' });
});

module.exports = router;
