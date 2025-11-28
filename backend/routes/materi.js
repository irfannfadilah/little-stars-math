const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// GET all materi
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT m.*, u.nama as nama_guru 
      FROM materi m 
      LEFT JOIN users u ON m.id_guru = u.id
      ORDER BY m.created_at DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Get materi error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});

// GET single materi
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT m.*, u.nama as nama_guru FROM materi m LEFT JOIN users u ON m.id_guru = u.id WHERE m.id = ?',
      [req.params.id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Materi tidak ditemukan' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Get materi error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});

// POST create materi (guru & admin only)
router.post('/', authenticateToken, authorizeRole('guru', 'admin'), async (req, res) => {
  try {
    const { judul, deskripsi, isi_materi } = req.body;
    
    const [result] = await db.query(
      'INSERT INTO materi (judul, deskripsi, isi_materi, id_guru) VALUES (?, ?, ?, ?)',
      [judul, deskripsi, isi_materi, req.user.id]
    );

    // Log aktivitas
    await db.query(
      'INSERT INTO aktivitas_log (id_user, jenis_aktivitas, deskripsi) VALUES (?, ?, ?)',
      [req.user.id, 'create_materi', `Menambahkan materi: ${judul}`]
    );

    res.status(201).json({ 
      id: result.insertId, 
      message: 'Materi berhasil ditambahkan' 
    });
  } catch (error) {
    console.error('Create materi error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});

// PUT update materi
router.put('/:id', authenticateToken, authorizeRole('guru', 'admin'), async (req, res) => {
  try {
    const { judul, deskripsi, isi_materi } = req.body;
    
    const [result] = await db.query(
      'UPDATE materi SET judul = ?, deskripsi = ?, isi_materi = ? WHERE id = ?',
      [judul, deskripsi, isi_materi, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Materi tidak ditemukan' });
    }

    // Log aktivitas
    await db.query(
      'INSERT INTO aktivitas_log (id_user, jenis_aktivitas, deskripsi) VALUES (?, ?, ?)',
      [req.user.id, 'update_materi', `Mengupdate materi ID: ${req.params.id}`]
    );

    res.json({ message: 'Materi berhasil diupdate' });
  } catch (error) {
    console.error('Update materi error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});

// DELETE materi
router.delete('/:id', authenticateToken, authorizeRole('guru', 'admin'), async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM materi WHERE id = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Materi tidak ditemukan' });
    }

    // Log aktivitas
    await db.query(
      'INSERT INTO aktivitas_log (id_user, jenis_aktivitas, deskripsi) VALUES (?, ?, ?)',
      [req.user.id, 'delete_materi', `Menghapus materi ID: ${req.params.id}`]
    );

    res.json({ message: 'Materi berhasil dihapus' });
  } catch (error) {
    console.error('Delete materi error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});

module.exports = router;
