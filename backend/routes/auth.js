const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../config/db');
const { authenticateToken } = require('../middleware/auth');

// Register (create local user)
router.post('/register', async (req, res) => {
  try {
    const { nama, email, password, role } = req.body;
    if (!nama || !email || !password) return res.status(400).json({ error: 'Missing required fields' });

    // Check if email already exists
    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Email sudah terdaftar' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const [result] = await db.query('INSERT INTO users (nama, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, NOW())', [nama, email, password_hash, role || 'siswa']);

    const userId = result.insertId;

    // Create JWT token
    const token = jwt.sign({ id: userId, email, role: role || 'siswa' }, process.env.JWT_SECRET, { expiresIn: '24h' });

    // Log aktivitas
    await db.query('INSERT INTO aktivitas_log (id_user, jenis_aktivitas, deskripsi) VALUES (?, ?, ?)', [userId, 'register', `User ${nama} mendaftar`]);

    res.json({ token, user: { id: userId, nama, email, role: role || 'siswa' } });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});

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

    // Compare password with bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
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
