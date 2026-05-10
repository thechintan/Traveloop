const express = require('express');
const db = require('../db/database');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

// Get packing items for trip
router.get('/trip/:tripId', authMiddleware, (req, res) => {
  const items = db.prepare('SELECT * FROM packing_items WHERE trip_id = ? ORDER BY category, item_name').all(req.params.tripId);
  res.json(items);
});

// Add item
router.post('/', authMiddleware, (req, res) => {
  const { trip_id, item_name, category } = req.body;
  const result = db.prepare('INSERT INTO packing_items (trip_id, item_name, category) VALUES (?,?,?)').run(trip_id, item_name, category || 'general');
  res.status(201).json(db.prepare('SELECT * FROM packing_items WHERE id = ?').get(result.lastInsertRowid));
});

// Toggle packed
router.put('/:id/toggle', authMiddleware, (req, res) => {
  db.prepare('UPDATE packing_items SET is_packed = NOT is_packed WHERE id = ?').run(req.params.id);
  res.json(db.prepare('SELECT * FROM packing_items WHERE id = ?').get(req.params.id));
});

// Delete item
router.delete('/:id', authMiddleware, (req, res) => {
  db.prepare('DELETE FROM packing_items WHERE id = ?').run(req.params.id);
  res.json({ message: 'Item deleted' });
});

// Reset checklist
router.post('/trip/:tripId/reset', authMiddleware, (req, res) => {
  db.prepare('UPDATE packing_items SET is_packed = 0 WHERE trip_id = ?').run(req.params.tripId);
  res.json({ message: 'Checklist reset' });
});

module.exports = router;
