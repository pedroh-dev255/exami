const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  // Serializa objetos Date enviados pelo Node no fuso UTC.
  timezone: "Z",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// CURRENT_TIMESTAMP e valores TIMESTAMP dependem do fuso da sessão MySQL.
// Cada conexão do pool é inicializada em UTC antes de executar as consultas.
pool.on("connection", (connection) => {
  connection.query("SET time_zone = '+00:00'");
});

module.exports = pool;
