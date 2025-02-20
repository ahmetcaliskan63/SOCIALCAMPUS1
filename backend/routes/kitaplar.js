const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Debug için route'ları logla
router.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

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
    console.log("Veritabanı bağlantısı OK");

    // Kitapları getir - JOIN olmadan
    const [kitaplar] = await db.execute(`
      SELECT * FROM kitaplar 
      ORDER BY created_at DESC
    `);

    console.log("Sorgu başarılı, kitap sayısı:", kitaplar.length);

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

    // Frontend'den gelen veriyi backend formatına dönüştür
    const kitapData = {
      baslik: req.body.baslik,
      yazar: req.body.yazar || "Belirtilmemiş",
      aciklama: req.body.aciklama || req.body.baslik,
      fiyat: Number(req.body.fiyat),
      fakulte: req.body.satici_fakulte?.toLowerCase() || "genel",
      kategori: req.body.kategori?.toLowerCase() || "diger",
      kullanici_id: req.body.satici_id?.toString(), // satici_id'yi kullanici_id olarak kullan
      instagram: req.body.instagram || "",
      resim_url: req.body.resim_url || "",
    };

    // Veri doğrulama
    if (!kitapData.baslik || !kitapData.fiyat || !kitapData.kullanici_id) {
      return res.status(400).json({
        success: false,
        error: "Gerekli alanlar eksik",
        required: ["baslik", "fiyat", "satici_id"],
        received: req.body,
      });
    }

    // Veritabanına kaydet
    const [result] = await db.execute(
      `INSERT INTO kitaplar 
       (baslik, yazar, aciklama, fiyat, fakulte, kategori, kullanici_id, instagram, resim_url) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        kitapData.baslik,
        kitapData.yazar,
        kitapData.aciklama,
        kitapData.fiyat,
        kitapData.fakulte,
        kitapData.kategori,
        kitapData.kullanici_id,
        kitapData.instagram,
        kitapData.resim_url,
      ]
    );

    // Eklenen kitabı getir
    const [kitap] = await db.execute("SELECT * FROM kitaplar WHERE id = ?", [
      result.insertId,
    ]);

    // Yanıta satıcı bilgilerini ekle
    const kitapWithSeller = {
      ...kitap[0],
      satici_adi: req.body.satici_adi,
      satici_fakulte: req.body.satici_fakulte,
      satici_bolum: req.body.satici_bolum,
    };

    res.status(201).json({
      success: true,
      data: kitapWithSeller,
      message: "Kitap başarıyla eklendi",
    });
  } catch (error) {
    console.error("Kitap ekleme hatası:", error);
    res.status(500).json({
      success: false,
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
