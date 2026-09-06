const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../db/database');
const { JWT_SECRET, authenticateToken, requireAdmin } = require('../middleware/auth');

// Register
router.post('/register', (req, res) => {
  try {
    const { email, password, full_name, company_name, country, phone, role } = req.body;

    if (!email || !password || !full_name) {
      return res.status(400).json({ error: 'Email, password, and full name are required.' });
    }

    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase());
    if (existingUser) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    const userId = 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const passwordHash = bcrypt.hashSync(password, 10);
    const userRole = role === 'admin' ? 'admin' : 'customer';

    db.prepare(`
      INSERT INTO users (id, email, password_hash, full_name, company_name, country, phone, role)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(userId, email.toLowerCase(), passwordHash, full_name, company_name || '', country || 'Sri Lanka', phone || '', userRole);

    const user = {
      id: userId,
      email: email.toLowerCase(),
      full_name,
      company_name: company_name || '',
      country: country || 'Sri Lanka',
      phone: phone || '',
      role: userRole
    };

    const token = jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ user, token });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Registration failed: ' + err.message });
  }
});

// Login
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase());
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = bcrypt.compareSync(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const userPayload = {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      company_name: user.company_name,
      country: user.country,
      phone: user.phone,
      role: user.role,
      avatar_url: user.avatar_url
    };

    const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '7d' });
    res.json({ user: userPayload, token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed: ' + err.message });
  }
});

// Google OAuth Mock Sign-In
router.post('/google-demo', (req, res) => {
  try {
    const { email, full_name, avatar_url, country, company_name } = req.body;
    const cleanEmail = (email || 'buyer.demo@international-imports.com').toLowerCase();

    let user = db.prepare('SELECT * FROM users WHERE email = ?').get(cleanEmail);

    if (!user) {
      const userId = 'usr_g_' + Date.now();
      const passwordHash = bcrypt.hashSync('GoogleDemoAuth2026!', 10);
      db.prepare(`
        INSERT INTO users (id, email, password_hash, full_name, company_name, country, phone, role, avatar_url)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        userId,
        cleanEmail,
        passwordHash,
        full_name || 'International Buyer',
        company_name || 'Global Organic Foods Ltd',
        country || 'United Kingdom',
        '+44 7700 900077',
        'customer',
        avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
      );
      user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
    }

    const userPayload = {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      company_name: user.company_name,
      country: user.country,
      phone: user.phone,
      role: user.role,
      avatar_url: user.avatar_url
    };

    const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '7d' });
    res.json({ user: userPayload, token });
  } catch (err) {
    console.error('Google demo login error:', err);
    res.status(500).json({ error: 'OAuth simulation failed: ' + err.message });
  }
});

// Current User profile
router.get('/me', authenticateToken, (req, res) => {
  const user = db.prepare('SELECT id, email, full_name, company_name, country, phone, role, avatar_url, created_at FROM users WHERE id = ?').get(req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({ user });
});

// Update Profile (Admin / Customer)
router.put('/profile', authenticateToken, (req, res) => {
  try {
    const { full_name, email, phone, company_name, country, avatar_url } = req.body;
    
    if (!full_name) {
      return res.status(400).json({ error: 'Full name is required' });
    }

    db.prepare(`
      UPDATE users
      SET full_name = ?, phone = ?, company_name = ?, country = ?, avatar_url = COALESCE(?, avatar_url)
      WHERE id = ?
    `).run(full_name, phone || '', company_name || '', country || 'Sri Lanka', avatar_url || null, req.user.id);

    const updated = db.prepare('SELECT id, email, full_name, company_name, country, phone, role, avatar_url, created_at FROM users WHERE id = ?').get(req.user.id);
    
    const token = jwt.sign(updated, JWT_SECRET, { expiresIn: '7d' });
    res.json({ message: 'Profile updated successfully', user: updated, token });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ error: 'Failed to update profile: ' + err.message });
  }
});

// Change Password
router.put('/change-password', authenticateToken, (req, res) => {
  try {
    const { current_password, new_password } = req.body;

    if (!current_password || !new_password) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    if (new_password.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters long' });
    }

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isMatch = bcrypt.compareSync(current_password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Incorrect current password' });
    }

    const newHash = bcrypt.hashSync(new_password, 10);
    db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(newHash, req.user.id);

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ error: 'Failed to change password: ' + err.message });
  }
});

// Admin: Get all registered customers
router.get('/users', requireAdmin, (req, res) => {
  const users = db.prepare(`
    SELECT u.id, u.email, u.full_name, u.company_name, u.country, u.phone, u.role, u.created_at,
           COUNT(o.id) as order_count,
           COALESCE(SUM(o.total_amount), 0) as total_spend
    FROM users u
    LEFT JOIN orders o ON u.id = o.user_id
    GROUP BY u.id
    ORDER BY u.created_at DESC
  `).all();
  res.json({ users });
});

module.exports = router;
