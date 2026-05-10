const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/trips', require('./routes/trips'));
app.use('/api/stops', require('./routes/stops'));
app.use('/api/cities', require('./routes/cities'));
app.use('/api/activities', require('./routes/activities'));
app.use('/api/packing', require('./routes/packing'));
app.use('/api/notes', require('./routes/notes'));
app.use('/api/budget', require('./routes/budget'));
app.use('/api/share', require('./routes/share'));
app.use('/api/admin', require('./routes/admin'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

app.listen(PORT, () => {
  console.log(`🌍 Traveloop API running on http://localhost:${PORT}`);
});
