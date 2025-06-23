// db.js
const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'dishad123', // ✅ update if needed
  database: 'ecommerce', // ✅ update this
});

// Optional: test connection on startup
(async () => {
  try {
    const connection = await db.getConnection();
    console.log("✅ MySQL connected successfully!");
    connection.release();
  } catch (err) {
    console.error("❌ Failed to connect to MySQL:", err.message);
  }
})();

module.exports = db;
