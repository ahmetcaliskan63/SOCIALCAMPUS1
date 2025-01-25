const express = require('express');
const router = express.Router();
const db = require('../config/database');

// CORS middleware ekle
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Content-Type', 'application/json');
  next();
});

// Test endpoint'i
router.get('/test', (req, res) => {
  res.json({ message: 'API çalışıyor' });
});

// Kullanıcı kaydı
router.post('/register', async (req, res) => {
  try {
    // Gelen veriyi detaylı logla
    console.log('Register isteği detayları:', {
      tumVeri: req.body,
      tamAd: {
        deger: req.body.tam_ad,
        tip: typeof req.body.tam_ad,
        uzunluk: req.body.tam_ad ? req.body.tam_ad.length : 0,
        boslukVarMi: req.body.tam_ad ? req.body.tam_ad.includes(' ') : false
      },
      fakulte: req.body.fakulte,
      bolum: req.body.bolum,
      sartlar: req.body.sartlari_kabul,
      sozlesme: req.body.sozlesmeyi_kabul
    });

    const {
      tam_ad,
      fakulte,
      fakulte_adi,
      bolum,
      sartlari_kabul,
      sozlesmeyi_kabul
    } = req.body;

    // tam_ad özel kontrolü
    if (!tam_ad || typeof tam_ad !== 'string' || tam_ad.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Ad Soyad alanı geçerli bir değer olmalıdır'
      });
    }

    // Diğer zorunlu alanları kontrol et
    if (!fakulte || !fakulte_adi || !bolum) {
      return res.status(400).json({
        success: false,
        message: 'Tüm zorunlu alanları doldurun'
      });
    }

    // Switch değerlerini kontrol et
    if (sartlari_kabul !== 1 || sozlesmeyi_kabul !== 1) {
      return res.status(400).json({
        success: false,
        message: 'Lütfen sözleşmeleri kabul edin'
      });
    }

    // SQL sorgusunu hazırla
    const sql = `
      INSERT INTO kullanicilar 
      (tam_ad, fakulte, fakulte_adi, bolum, sartlari_kabul, sozlesmeyi_kabul) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    // Parametreleri hazırla
    const values = [
      tam_ad,
      fakulte,
      fakulte_adi,
      bolum,
      sartlari_kabul,
      sozlesmeyi_kabul
    ];

    // SQL sorgusunu logla
    console.log('SQL:', sql);
    console.log('Değerler:', values);

    // Veritabanına kaydet
    const [result] = await db.query(sql, values);

    // Başarılı yanıt döndür
    return res.status(201).json({
      success: true,
      message: 'Kullanıcı başarıyla kaydedildi',
      data: {
        userId: result.insertId
      }
    });

  } catch (error) {
    // Hata detaylarını logla
    console.error('Kayıt hatası:', error);

    // MySQL hata kodlarını kontrol et
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        message: 'Bu kullanıcı zaten kayıtlı'
      });
    }

    // Genel hata yanıtı
    return res.status(500).json({
      success: false,
      message: 'Sunucu hatası oluştu',
      error: error.message
    });
  }
});

module.exports = router; 