const express = require('express');
const db = require('../db/database');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

// Get budget for trip
router.get('/trip/:tripId', authMiddleware, (req, res) => {
  const trip = db.prepare('SELECT * FROM trips WHERE id = ? AND user_id = ?').get(req.params.tripId, req.user.id);
  if (!trip) return res.status(404).json({ error: 'Trip not found' });

  const stops = db.prepare(`
    SELECT ts.*, c.name as city_name FROM trip_stops ts JOIN cities c ON ts.city_id = c.id WHERE ts.trip_id = ?
  `).all(req.params.tripId);

  let totalTransport = 0, totalAccommodation = 0, totalActivities = 0;
  const breakdown = [];

  stops.forEach(stop => {
    const activities = db.prepare(`
      SELECT SUM(a.estimated_cost) as total FROM stop_activities sa JOIN activities a ON sa.activity_id = a.id WHERE sa.stop_id = ?
    `).get(stop.id);
    const actCost = activities?.total || 0;
    totalTransport += stop.transport_cost || 0;
    totalAccommodation += stop.accommodation_cost || 0;
    totalActivities += actCost;

    const days = stop.arrival_date && stop.departure_date
      ? Math.max(1, Math.ceil((new Date(stop.departure_date) - new Date(stop.arrival_date)) / 86400000))
      : 1;

    breakdown.push({
      city: stop.city_name,
      days,
      transport: stop.transport_cost || 0,
      accommodation: stop.accommodation_cost || 0,
      activities: actCost,
      total: (stop.transport_cost || 0) + (stop.accommodation_cost || 0) + actCost
    });
  });

  const totalDays = stops.reduce((sum, s) => {
    if (s.arrival_date && s.departure_date) {
      return sum + Math.max(1, Math.ceil((new Date(s.departure_date) - new Date(s.arrival_date)) / 86400000));
    }
    return sum + 1;
  }, 0);

  const estimatedMeals = totalDays * 30;
  const grandTotal = totalTransport + totalAccommodation + totalActivities + estimatedMeals;

  res.json({
    summary: { transport: totalTransport, accommodation: totalAccommodation, activities: totalActivities, meals: estimatedMeals, total: grandTotal, totalDays, avgPerDay: totalDays > 0 ? Math.round(grandTotal / totalDays) : 0 },
    breakdown
  });
});

module.exports = router;
