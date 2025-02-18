const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const connection = mysql.createPool({
    host: 'yamabiko.proxy.rlwy.net',
    port: 24760,
    user: 'root',
    password: 'XNpcNGoviOKfDNkHdBxpECMpFyMAmOnC',
    database: 'railway',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 60000 // 60 saniye
});

// Test bağlantısı
connection.getConnection((err, conn) => {
    if (err) {
        console.error('Veritabanı bağlantı hatası:', err);
        return;
    }
    console.log('MySQL veritabanına bağlandı');
    conn.release();
});

module.exports = connection.promise(); 