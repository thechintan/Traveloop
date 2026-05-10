const express = require('express');
const db = require('../db/database');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

// Admin check middleware
function adminOnly(req, res, next) {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
  next();
}

// Dashboard stats
router.get('/stats', authMiddleware, adminOnly, (req, res) => {
  const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  const totalTrips = db.prepare('SELECT COUNT(*) as count FROM trips').get().count;
  const publicTrips = db.prepare('SELECT COUNT(*) as count FROM trips WHERE is_public = 1').get().count;
  const totalStops = db.prepare('SELECT COUNT(*) as count FROM trip_stops').get().count;

  const topCities = db.prepare(`
    SELECT c.name, c.country, COUNT(ts.id) as trip_count
    FROM trip_stops ts JOIN cities c ON ts.city_id = c.id
    GROUP BY c.id ORDER BY trip_count DESC LIMIT 10
  `).all();

  const topActivities = db.prepare(`
    SELECT a.name, a.category, COUNT(sa.id) as usage_count
    FROM stop_activities sa JOIN activities a ON sa.activity_id = a.id
    GROUP BY a.id ORDER BY usage_count DESC LIMIT 10
  `).all();

  const recentTrips = db.prepare(`
    SELECT t.name, t.created_at, u.name as user_name
    FROM trips t JOIN users u ON t.user_id = u.id ORDER BY t.created_at DESC LIMIT 10
  `).all();

  const userGrowth = db.prepare(`
    SELECT DATE(created_at) as date, COUNT(*) as count FROM users GROUP BY DATE(created_at) ORDER BY date DESC LIMIT 30
  `).all();

  res.json({ totalUsers, totalTrips, publicTrips, totalStops, topCities, topActivities, recentTrips, userGrowth });
});

// List users
router.get('/users', authMiddleware, adminOnly, (req, res) => {
  const users = db.prepare('SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC').all();
  res.json(users);
});

module.exports = router;
