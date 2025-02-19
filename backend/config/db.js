const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

dotenv.config();

const pool = mysql.createPool({
  host: "yamabiko.proxy.rlwy.net",
  port: 24760,
  user: "root",
  password: "XNpcNGoviOKfDNkHdBxpECMpFyMAmOnC",
  database: "railway",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

// Bağlantıyı test et
pool
  .getConnection()
  .then((connection) => {
    console.log("Database bağlantısı başarılı");
    connection.release();
  })
  .catch((err) => {
    console.error("Database bağlantı hatası:", err);
    process.exit(1); // Bağlantı başarısız ise uygulamayı durdur
  });

module.exports = pool;
