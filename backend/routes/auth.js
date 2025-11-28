const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { authenticateToken } = require('../middleware/auth');

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const [users] = await db.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Email atau password salah' });
    }

    const user = users[0];

    // Simple password check (in production, use bcrypt)
    if (password !== user.password_hash) {
      return res.status(401).json({ error: 'Email atau password salah' });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Log aktivitas
    await db.query(
      'INSERT INTO aktivitas_log (id_user, jenis_aktivitas, deskripsi) VALUES (?, ?, ?)',
      [user.id, 'login', `User ${user.nama} berhasil login`]
    );

    res.json({
      token,
      user: {
        id: user.id,
        nama: user.nama,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});

// Get current user
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT id, nama, email, role, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User tidak ditemukan' });
    }

    res.json(users[0]);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});

// Logout (just for logging purposes)
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    await db.query(
      'INSERT INTO aktivitas_log (id_user, jenis_aktivitas, deskripsi) VALUES (?, ?, ?)',
      [req.user.id, 'logout', `User berhasil logout`]
    );
    res.json({ message: 'Logout berhasil' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});

module.exports = router;
