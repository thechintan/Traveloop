const express = require('express');
const db = require('../db/database');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

// Get notes for trip
router.get('/trip/:tripId', authMiddleware, (req, res) => {
  const notes = db.prepare(`
    SELECT tn.*, ts.id as stop_id, c.name as city_name
    FROM trip_notes tn LEFT JOIN trip_stops ts ON tn.stop_id = ts.id
    LEFT JOIN cities c ON ts.city_id = c.id WHERE tn.trip_id = ? ORDER BY tn.created_at DESC
  `).all(req.params.tripId);
  res.json(notes);
});

// Create note
router.post('/', authMiddleware, (req, res) => {
  const { trip_id, stop_id, title, content } = req.body;
  const result = db.prepare('INSERT INTO trip_notes (trip_id, stop_id, title, content) VALUES (?,?,?,?)').run(trip_id, stop_id || null, title || null, content || null);
  res.status(201).json(db.prepare('SELECT * FROM trip_notes WHERE id = ?').get(result.lastInsertRowid));
});

// Update note
router.put('/:id', authMiddleware, (req, res) => {
  const { title, content, stop_id } = req.body;
  db.prepare('UPDATE trip_notes SET title=COALESCE(?,title), content=COALESCE(?,content), stop_id=COALESCE(?,stop_id), updated_at=CURRENT_TIMESTAMP WHERE id=?')
    .run(title || null, content || null, stop_id || null, req.params.id);
  res.json(db.prepare('SELECT * FROM trip_notes WHERE id = ?').get(req.params.id));
});

// Delete note
router.delete('/:id', authMiddleware, (req, res) => {
  db.prepare('DELETE FROM trip_notes WHERE id = ?').run(req.params.id);
  res.json({ message: 'Note deleted' });
});

module.exports = router;
