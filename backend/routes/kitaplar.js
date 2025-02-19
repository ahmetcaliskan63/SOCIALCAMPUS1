const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Route'ları logla
console.log("Kitaplar route'ları yüklendi");
console.log("GET /api/kitaplar");
console.log("GET /api/books");
console.log("POST /api/kitap");

// Tüm kitapları getir
router.get("/kitaplar", async (req, res) => {
  console.log("GET /api/kitaplar isteği alındı");
  try {
    // Veritabanı bağlantısını kontrol et
    await db.execute("SELECT 1");

    // Kitapları getir
    const [kitaplar] = await db.execute(`
      SELECT k.*, 
             u.tam_ad as satici_adi, 
             u.fakulte as satici_fakulte, 
             u.bolum as satici_bolum
      FROM kitaplar k
      LEFT JOIN kullanicilar u ON k.kullanici_id = u.id
      ORDER BY k.created_at DESC
    `);

    console.log("Bulunan kitap sayısı:", kitaplar.length);

    res.json({
      success: true,
      data: kitaplar,
      message: kitaplar.length === 0 ? "Henüz kitap bulunmuyor" : undefined,
    });
  } catch (error) {
    console.error("Kitapları getirme hatası:", error);
    res.status(500).json({
      success: false,
      error: "Kitaplar alınırken bir hata oluştu",
      details: error.message,
    });
  }
});

// Kitap ekleme
router.post("/kitap", async (req, res) => {
  try {
    console.log("Gelen kitap verisi:", req.body);
    const {
      baslik,
      yazar,
      aciklama,
      fiyat,
      fakulte,
      kategori,
      kullanici_id,
      instagram,
      resim_url,
    } = req.body;

    // Veri doğrulama
    if (!baslik || !fiyat || !kullanici_id || !instagram || !resim_url) {
      return res.status(400).json({
        error: "Gerekli alanlar eksik",
        received: req.body,
      });
    }

    // Veritabanına kaydet
    const [result] = await db.execute(
      `INSERT INTO kitaplar 
       (baslik, yazar, aciklama, fiyat, fakulte, kategori, kullanici_id, instagram, resim_url) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        baslik,
        yazar || "Belirtilmemiş",
        aciklama || baslik,
        Number(fiyat),
        fakulte?.toLowerCase() || "genel",
        kategori?.toLowerCase() || "diger",
        kullanici_id,
        instagram,
        resim_url,
      ]
    );

    console.log("Kitap eklendi, ID:", result.insertId);

    // Eklenen kitabı getir
    const [kitap] = await db.execute(
      `
      SELECT k.*, 
             u.tam_ad as satici_adi, 
             u.fakulte as satici_fakulte, 
             u.bolum as satici_bolum
      FROM kitaplar k
      LEFT JOIN kullanicilar u ON k.kullanici_id = u.id
      WHERE k.id = ?
    `,
      [result.insertId]
    );

    res.status(201).json(kitap[0]);
  } catch (error) {
    console.error("Kitap ekleme hatası:", error);
    res.status(500).json({
      error: "Kitap eklenirken bir hata oluştu",
      details: error.message,
    });
  }
});

// Kategori bazlı kitapları getir
router.get("/kitaplar/kategori/:kategori", async (req, res) => {
  try {
    const [kitaplar] = await db.execute(
      "SELECT * FROM kitaplar WHERE kategori = ? ORDER BY created_at DESC",
      [req.params.kategori.toLowerCase()]
    );
    res.json(kitaplar);
  } catch (error) {
    console.error("Kategori bazlı kitapları getirme hatası:", error);
    res.status(500).json({ error: "Kitaplar alınırken bir hata oluştu" });
  }
});

// Fakülte bazlı kitapları getir
router.get("/kitaplar/fakulte/:fakulte", async (req, res) => {
  try {
    const [kitaplar] = await db.execute(
      "SELECT * FROM kitaplar WHERE fakulte = ? ORDER BY created_at DESC",
      [req.params.fakulte.toLowerCase()]
    );
    res.json(kitaplar);
  } catch (error) {
    console.error("Fakülte bazlı kitapları getirme hatası:", error);
    res.status(500).json({ error: "Kitaplar alınırken bir hata oluştu" });
  }
});

module.exports = router;
