const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');

// Mesaj gönderme
router.post('/', async (req, res) => {
  try {
    const {
      kullanici_id,
      kullanici_adi,
      icerik
    } = req.body;

    // Gerekli alanların kontrolü
    if (!kullanici_id || !kullanici_adi || !icerik) {
      return res.status(400).json({
        success: false,
        message: 'Tüm alanları doldurun'
      });
    }

    const id = uuidv4();

    await db.query(
      'INSERT INTO mesajlar (id, kullanici_id, kullanici_adi, icerik) VALUES (?, ?, ?, ?)',
      [id, kullanici_id, kullanici_adi, icerik]
    );

    res.status(201).json({
      success: true,
      data: {
        id,
        kullanici_id,
        kullanici_adi,
        icerik,
        olusturma_tarihi: new Date()
      }
    });
  } catch (error) {
    console.error('Create message error:', error);
    res.status(500).json({ success: false, message: 'Mesaj gönderilemedi' });
  }
});

// Tüm mesajları getirme
router.get('/', async (req, res) => {
  try {
    const [messages] = await db.query(
      'SELECT * FROM mesajlar ORDER BY olusturma_tarihi DESC'
    );

    res.json({
      success: true,
      data: messages
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ success: false, message: 'Mesajlar getirilemedi' });
  }
});

// Kullanıcının mesajlarını getirme
router.get('/kullanici/:kullanici_id', async (req, res) => {
  try {
    const [messages] = await db.query(
      'SELECT * FROM mesajlar WHERE kullanici_id = ? ORDER BY olusturma_tarihi DESC',
      [req.params.kullanici_id]
    );

    res.json({
      success: true,
      data: messages
    });
  } catch (error) {
    console.error('Get user messages error:', error);
    res.status(500).json({ success: false, message: 'Kullanıcı mesajları getirilemedi' });
  }
});

// Mesaj silme
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query(
      'DELETE FROM mesajlar WHERE id = ?',
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Mesaj bulunamadı'
      });
    }

    res.json({
      success: true,
      message: 'Mesaj başarıyla silindi'
    });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ success: false, message: 'Mesaj silinemedi' });
  }
});

module.exports = router; 