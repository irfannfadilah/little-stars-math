const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// GET all latihan
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { tingkat_kesulitan } = req.query;
    
    let query = `
      SELECT l.*, u.nama as nama_guru 
      FROM latihan l 
      LEFT JOIN users u ON l.id_guru = u.id
    `;
    const params = [];

    if (tingkat_kesulitan) {
      query += ' WHERE l.tingkat_kesulitan = ?';
      params.push(tingkat_kesulitan);
    }

    query += ' ORDER BY l.created_at DESC';

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Get latihan error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});

// GET single latihan
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT l.*, u.nama as nama_guru FROM latihan l LEFT JOIN users u ON l.id_guru = u.id WHERE l.id = ?',
      [req.params.id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Latihan tidak ditemukan' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Get latihan error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});

// POST create latihan (guru & admin only)
router.post('/', authenticateToken, authorizeRole('guru', 'admin'), async (req, res) => {
  try {
    const { judul, pertanyaan, jawaban_benar, tingkat_kesulitan } = req.body;
    
    const [result] = await db.query(
      'INSERT INTO latihan (judul, pertanyaan, jawaban_benar, tingkat_kesulitan, id_guru) VALUES (?, ?, ?, ?, ?)',
      [judul, pertanyaan, jawaban_benar, tingkat_kesulitan, req.user.id]
    );

    // Log aktivitas
    await db.query(
      'INSERT INTO aktivitas_log (id_user, jenis_aktivitas, deskripsi) VALUES (?, ?, ?)',
      [req.user.id, 'create_latihan', `Menambahkan latihan: ${judul}`]
    );

    res.status(201).json({ 
      id: result.insertId, 
      message: 'Latihan berhasil ditambahkan' 
    });
  } catch (error) {
    console.error('Create latihan error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});

// PUT update latihan
router.put('/:id', authenticateToken, authorizeRole('guru', 'admin'), async (req, res) => {
  try {
    const { judul, pertanyaan, jawaban_benar, tingkat_kesulitan } = req.body;
    
    const [result] = await db.query(
      'UPDATE latihan SET judul = ?, pertanyaan = ?, jawaban_benar = ?, tingkat_kesulitan = ? WHERE id = ?',
      [judul, pertanyaan, jawaban_benar, tingkat_kesulitan, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Latihan tidak ditemukan' });
    }

    // Log aktivitas
    await db.query(
      'INSERT INTO aktivitas_log (id_user, jenis_aktivitas, deskripsi) VALUES (?, ?, ?)',
      [req.user.id, 'update_latihan', `Mengupdate latihan ID: ${req.params.id}`]
    );

    res.json({ message: 'Latihan berhasil diupdate' });
  } catch (error) {
    console.error('Update latihan error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});

// DELETE latihan
router.delete('/:id', authenticateToken, authorizeRole('guru', 'admin'), async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM latihan WHERE id = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Latihan tidak ditemukan' });
    }

    // Log aktivitas
    await db.query(
      'INSERT INTO aktivitas_log (id_user, jenis_aktivitas, deskripsi) VALUES (?, ?, ?)',
      [req.user.id, 'delete_latihan', `Menghapus latihan ID: ${req.params.id}`]
    );

    res.json({ message: 'Latihan berhasil dihapus' });
  } catch (error) {
    console.error('Delete latihan error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});

module.exports = router;
