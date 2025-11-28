const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// GET all aktivitas (admin only)
router.get('/', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT a.*, u.nama as nama_user 
      FROM aktivitas_log a 
      LEFT JOIN users u ON a.id_user = u.id
      ORDER BY a.waktu_aktivitas DESC
      LIMIT 100
    `);
    res.json(rows);
  } catch (error) {
    console.error('Get aktivitas error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});

// GET aktivitas by user
router.get('/user/:userId', authenticateToken, async (req, res) => {
  try {
    // Only allow users to see their own aktivitas, unless admin
    if (req.user.role !== 'admin' && req.user.id !== parseInt(req.params.userId)) {
      return res.status(403).json({ error: 'Akses ditolak' });
    }

    const [rows] = await db.query(
      'SELECT * FROM aktivitas_log WHERE id_user = ? ORDER BY waktu_aktivitas DESC LIMIT 50',
      [req.params.userId]
    );
    res.json(rows);
  } catch (error) {
    console.error('Get user aktivitas error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});

// POST create aktivitas log
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { jenis_aktivitas, deskripsi } = req.body;
    
    const [result] = await db.query(
      'INSERT INTO aktivitas_log (id_user, jenis_aktivitas, deskripsi) VALUES (?, ?, ?)',
      [req.user.id, jenis_aktivitas, deskripsi]
    );

    res.status(201).json({ 
      id: result.insertId, 
      message: 'Log aktivitas berhasil ditambahkan' 
    });
  } catch (error) {
    console.error('Create aktivitas error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});

module.exports = router;
