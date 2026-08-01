const mysql = require('mysql2/promise');

let pool;

function sslOption() {
  return process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined;
}

async function initDb() {
  const dbName = process.env.DB_NAME || 'stockportfolio';

  try {
    const setupConn = await mysql.createConnection({
      host: process.env.DB_HOST || '127.0.0.1',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      ssl: sslOption()
    });
    await setupConn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    await setupConn.end();
  } catch (err) {
    // Most hosted MySQL plans don't let you create databases — they give you
    // one already made. If that's what's happening, just move on.
    console.log('Skipping CREATE DATABASE (probably not permitted here):', err.message);
  }

  pool = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: dbName,
    ssl: sslOption(),
    waitForConnections: true,
    connectionLimit: 10
  });

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      otp VARCHAR(10),
      otp_expiry DATETIME,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS portfolio (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      stock_name VARCHAR(100) NOT NULL,
      quantity INT NOT NULL,
      buy_price DECIMAL(12,2) NOT NULL,
      current_price DECIMAL(12,2) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      stock_name VARCHAR(100) NOT NULL,
      type ENUM('BUY', 'SELL') NOT NULL,
      quantity INT NOT NULL,
      price DECIMAL(12,2) NOT NULL,
      total DECIMAL(12,2) NOT NULL,
      date DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  console.log('MySQL is connected and ready!');
}

function getPool() {
  if (!pool) throw new Error('Database not initialized yet');
  return pool;
}

module.exports = { initDb, getPool };
