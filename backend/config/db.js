const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const connection = mysql.createConnection({
    host: 'yamabiko.proxy.rlwy.net',
    port: 24760,
    user: 'root',
    password: 'XNpcNGoviOKfDNkHdBxpECMpFyMAmOnC',
    database: 'railway'
});

connection.connect((err) => {   
    if (err) {
        console.error('Veritabanı bağlantı hatası:', err);
        return;
    }
    console.log('MySQL veritabanına bağlandı');
});

module.exports = connection; 