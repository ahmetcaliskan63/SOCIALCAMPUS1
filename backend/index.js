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
        console.log('Gelen veri:', req.body);
        
        const [result] = await db.execute(
            'INSERT INTO kullanicilar (tam_ad, fakulte, fakulte_adi, bolum) VALUES (?, ?, ?, ?)',
            [req.body.tam_ad, req.body.fakulte, req.body.fakulte_adi, req.body.bolum]
        );

        res.json({ 
            success: true, 
            message: 'Kullanıcı oluşturuldu',
            userId: result.insertId 
        });
    } catch (error) {
        console.error('Hata:', error);
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
}); 