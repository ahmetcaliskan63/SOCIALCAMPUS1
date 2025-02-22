// POST /kullanicilar endpoint'i
router.post("/kullanicilar", async (req, res) => {
  try {
    // ... mevcut veri işleme kodu ...

    // Insert işlemi sonrası
    const insertResult = await db.query(/* ... insert query ... */);

    // Yeni eklenen kullanıcının bilgilerini al
    const [kullanici] = await db.query(
      "SELECT * FROM kullanicilar WHERE id = ?",
      [insertResult.insertId]
    );

    // Yanıtı doğru formatta gönder
    res.json({
      success: true,
      message: "Kullanıcı oluşturuldu",
      data: {
        id: insertResult.insertId,
        tam_ad: req.body.tam_ad,
        fakulte: req.body.faculty,
        fakulte_adi: req.body.faculty,
        bolum: req.body.department,
        sartlari_kabul: req.body.termsAccepted ? 1 : 0,
        sozlesmeyi_kabul: req.body.eulaAccepted ? 1 : 0,
        created_at: new Date(),
        guncelleme_tarihi: new Date(),
      },
    });
  } catch (error) {
    console.error("Kullanıcı oluşturma hatası:", error);
    res.status(500).json({
      success: false,
      message: "Kullanıcı oluşturulurken bir hata oluştu",
      error: error.message,
    });
  }
});
