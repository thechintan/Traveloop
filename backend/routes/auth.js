const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/database');
const { authMiddleware, JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

// Signup
router.post('/signup', (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'All fields required' });
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) return res.status(409).json({ error: 'Email already registered' });
    const hash = bcrypt.hashSync(password, 10);
    const result = db.prepare('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)').run(name, email, hash);
    const token = jwt.sign({ id: result.lastInsertRowid, email, name, role: 'user' }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: result.lastInsertRowid, name, email, role: 'user' } });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Login
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user || !bcrypt.compareSync(password, user.password_hash)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id, email: user.email, name: user.name, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar_url: user.avatar_url } });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Get profile
router.get('/profile', authMiddleware, (req, res) => {
  const user = db.prepare('SELECT id, name, email, avatar_url, language, role, created_at FROM users WHERE id = ?').get(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

// Update profile
router.put('/profile', authMiddleware, (req, res) => {
  const { name, language } = req.body;
  db.prepare('UPDATE users SET name = COALESCE(?, name), language = COALESCE(?, language) WHERE id = ?').run(name || null, language || null, req.user.id);
  const user = db.prepare('SELECT id, name, email, avatar_url, language, role FROM users WHERE id = ?').get(req.user.id);
  res.json(user);
});

// Change password
router.put('/password', authMiddleware, (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = db.prepare('SELECT password_hash FROM users WHERE id = ?').get(req.user.id);
  if (!bcrypt.compareSync(currentPassword, user.password_hash)) return res.status(401).json({ error: 'Current password incorrect' });
  db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(bcrypt.hashSync(newPassword, 10), req.user.id);
  res.json({ message: 'Password updated' });
});

module.exports = router;
