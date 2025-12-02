const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../config/db');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// GET all users (admin only)
router.get('/', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, nama, email, role, created_at FROM users ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});

// GET single user (admin only)
router.get('/:id', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, nama, email, role, created_at FROM users WHERE id = ?',
      [req.params.id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User tidak ditemukan' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});

// CREATE user (admin only)
router.post('/', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const { nama, email, password, role } = req.body;
    
    if (!nama || !email || !password || !role) {
      return res.status(400).json({ error: 'Semua field harus diisi' });
    }

    // Check if email already exists
    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Email sudah terdaftar' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const [result] = await db.query(
      'INSERT INTO users (nama, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [nama, email, hashedPassword, role]
    );

    // Log aktivitas
    await db.query(
      'INSERT INTO aktivitas_log (id_user, jenis_aktivitas, deskripsi) VALUES (?, ?, ?)',
      [req.user.id, 'create_user', `Menambahkan user: ${nama} (${email})`]
    );

    res.status(201).json({ 
      id: result.insertId, 
      message: 'User berhasil ditambahkan' 
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});

// UPDATE user (admin only)
router.put('/:id', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const { nama, email, role, password } = req.body;
    const userId = req.params.id;

    // Prevent admin from deleting themselves
    if (userId === req.user.id.toString() && role !== req.user.role) {
      return res.status(400).json({ error: 'Anda tidak bisa mengubah role Anda sendiri' });
    }

    let query = 'UPDATE users SET nama = ?, email = ?, role = ?';
    let params = [nama, email, role, userId];

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      query = 'UPDATE users SET nama = ?, email = ?, role = ?, password_hash = ?';
      params = [nama, email, role, hashedPassword, userId];
    }

    query += ' WHERE id = ?';

    const [result] = await db.query(query, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User tidak ditemukan' });
    }

    // Log aktivitas
    await db.query(
      'INSERT INTO aktivitas_log (id_user, jenis_aktivitas, deskripsi) VALUES (?, ?, ?)',
      [req.user.id, 'update_user', `Mengupdate user ID: ${userId}`]
    );

    res.json({ message: 'User berhasil diupdate' });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});

// DELETE user (admin only, cannot delete self)
router.delete('/:id', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const userId = req.params.id;

    if (userId === req.user.id.toString()) {
      return res.status(400).json({ error: 'Anda tidak bisa menghapus diri Anda sendiri' });
    }

    const [result] = await db.query('DELETE FROM users WHERE id = ?', [userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User tidak ditemukan' });
    }

    // Log aktivitas
    await db.query(
      'INSERT INTO aktivitas_log (id_user, jenis_aktivitas, deskripsi) VALUES (?, ?, ?)',
      [req.user.id, 'delete_user', `Menghapus user ID: ${userId}`]
    );

    res.json({ message: 'User berhasil dihapus' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});

module.exports = router;
