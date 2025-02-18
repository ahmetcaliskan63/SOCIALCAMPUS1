const express = require('express');
const cors = require('cors');
const db = require('./config/db');
const app = express();

app.use(cors());
app.use(express.json());

// Ana endpoint ve healthcheck için
app.get('/', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// Test endpoint
app.get('/test', (req, res) => {
    res.json({ message: 'API is running' });
});

// Kullanıcı oluşturma endpoint'i
app.post('/kullanicilar', async (req, res) => {
    try {
        // Gelen ham veriyi detaylı logla
        console.log('Ham veri detayları:', req.body);
        
        // Veriyi kontrol et ve alan isimlerini eşleştir
        const userData = {
            tam_ad: req.body.tam_ad || '',
            fakulte: req.body.faculty || '',           // faculty -> fakulte
            fakulte_adi: req.body.faculty || '',       // faculty -> fakulte_adi
            bolum: req.body.department || '',          // department -> bolum
            sartlari_kabul: req.body.termsAccepted ? 1 : 0,    // termsAccepted -> sartlari_kabul
            sozlesmeyi_kabul: req.body.eulaAccepted ? 1 : 0    // eulaAccepted -> sozlesmeyi_kabul
        };

        console.log('Dönüştürülmüş veri:', userData);

        // Veritabanı sorgusu
        const [result] = await db.execute(
            'INSERT INTO kullanicilar (tam_ad, fakulte, fakulte_adi, bolum, sartlari_kabul, sozlesmeyi_kabul) VALUES (?, ?, ?, ?, ?, ?)',
            [
                userData.tam_ad,
                userData.fakulte,
                userData.fakulte_adi,
                userData.bolum,
                userData.sartlari_kabul,
                userData.sozlesmeyi_kabul
            ]
        );

        console.log('Insert result:', result);

        // Oluşturulan kullanıcının bilgilerini al
        const [users] = await db.execute('SELECT * FROM kullanicilar WHERE id = ?', [result.insertId]);
        
        res.json({ 
            success: true, 
            message: 'Kullanıcı oluşturuldu',
            data: users[0]
        });
    } catch (error) {
        console.error('Detaylı hata:', error);
        res.status(500).json({ 
            error: error.message,
            details: 'Sunucu hatası oluştu'
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
}); 