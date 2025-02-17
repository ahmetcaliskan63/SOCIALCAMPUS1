const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

console.log('Database Config:', {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
});

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'yamabiko.proxy.rlwy.net',
    port: process.env.DB_PORT || 24760,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'XNpcNGoviOKfDNkHdBxpECMpFyMAmOnC',
    database: process.env.DB_NAME || 'railway',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Database connected successfully');
    connection.release();
});

// Promise wrapper
const promisePool = pool.promise();

module.exports = promisePool; 