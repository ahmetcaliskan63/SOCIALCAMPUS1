const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');

// Kitap ekleme
router.post('/', async (req, res) => {
  try {
    const {
      baslik,
      kategori,
      fiyat,
      instagram,
      resim_url,
      satici_id,
      satici_adi,
      satici_fakulte,
      satici_bolum
    } = req.body;

    const id = uuidv4();

    await db.query(
      `INSERT INTO kitaplar (
        id, baslik, kategori, fiyat, instagram, resim_url,
        satici_id, satici_adi, satici_fakulte, satici_bolum
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id, baslik, kategori, fiyat, instagram, resim_url,
        satici_id, satici_adi, satici_fakulte, satici_bolum
      ]
    );

    res.status(201).json({
      success: true,
      data: {
        id,
        baslik,
        kategori,
        fiyat,
        instagram,
        resim_url,
        satici_id,
        satici_adi,
        satici_fakulte,
        satici_bolum,
        durum: 'müsait'
      }
    });
  } catch (error) {
    console.error('Create book error:', error);
    res.status(500).json({ success: false, message: 'Kitap eklenemedi' });
  }
});

// Kitap listesi
router.get('/', async (req, res) => {
  try {
    const [books] = await db.query('SELECT * FROM kitaplar');
    res.json({
      success: true,
      data: books
    });
  } catch (error) {
    console.error('Get books error:', error);
    res.status(500).json({ success: false, message: 'Kitaplar getirilemedi' });
  }
});

// Kitap detayı
router.get('/:id', async (req, res) => {
  try {
    const [books] = await db.query('SELECT * FROM kitaplar WHERE id = ?', [req.params.id]);
    
    if (books.length === 0) {
      return res.status(404).json({ success: false, message: 'Kitap bulunamadı' });
    }

    res.json({
      success: true,
      data: books[0]
    });
  } catch (error) {
    console.error('Get book error:', error);
    res.status(500).json({ success: false, message: 'Kitap bilgileri alınamadı' });
  }
});

// Kitap güncelleme
router.put('/:id', async (req, res) => {
  try {
    const {
      baslik,
      kategori,
      fiyat,
      instagram,
      resim_url,
      durum
    } = req.body;

    await db.query(
      `UPDATE kitaplar 
       SET baslik = ?, kategori = ?, fiyat = ?, 
           instagram = ?, resim_url = ?, durum = ?
       WHERE id = ?`,
      [baslik, kategori, fiyat, instagram, resim_url, durum, req.params.id]
    );

    res.json({
      success: true,
      data: {
        id: req.params.id,
        baslik,
        kategori,
        fiyat,
        instagram,
        resim_url,
        durum
      }
    });
  } catch (error) {
    console.error('Update book error:', error);
    res.status(500).json({ success: false, message: 'Kitap güncellenemedi' });
  }
});

// Kitap silme
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM kitaplar WHERE id = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Kitap bulunamadı' });
    }

    res.json({
      success: true,
      message: 'Kitap başarıyla silindi'
    });
  } catch (error) {
    console.error('Delete book error:', error);
    res.status(500).json({ success: false, message: 'Kitap silinemedi' });
  }
});

// Kategoriye göre kitapları getirme
router.get('/kategori/:kategori', async (req, res) => {
  try {
    const [books] = await db.query(
      'SELECT * FROM kitaplar WHERE kategori = ?',
      [req.params.kategori]
    );

    res.json({
      success: true,
      data: books
    });
  } catch (error) {
    console.error('Get books by category error:', error);
    res.status(500).json({ success: false, message: 'Kitaplar getirilemedi' });
  }
});

// Fakülteye göre kitapları getirme
router.get('/fakulte/:fakulte', async (req, res) => {
  try {
    const [books] = await db.query(
      'SELECT * FROM kitaplar WHERE satici_fakulte = ?',
      [req.params.fakulte]
    );

    res.json({
      success: true,
      data: books
    });
  } catch (error) {
    console.error('Get books by faculty error:', error);
    res.status(500).json({ success: false, message: 'Kitaplar getirilemedi' });
  }
});

// Fiyat aralığına göre kitapları getirme
router.get('/fiyat', async (req, res) => {
  try {
    const { min, max } = req.query;
    
    if (!min || !max) {
      return res.status(400).json({ 
        success: false, 
        message: 'Minimum ve maximum fiyat değerleri gerekli' 
      });
    }

    const [books] = await db.query(
      'SELECT * FROM kitaplar WHERE fiyat BETWEEN ? AND ?',
      [min, max]
    );

    res.json({
      success: true,
      data: books
    });
  } catch (error) {
    console.error('Get books by price range error:', error);
    res.status(500).json({ success: false, message: 'Kitaplar getirilemedi' });
  }
});

module.exports = router; 