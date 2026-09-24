import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

// Shared pool for API routes that need to talk to the database directly
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: "root",
  password: process.env.DB_PASSWORD,
  database: "fruit-basket-db",
  connectionLimit: 5,
});

export default pool;
