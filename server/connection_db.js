// Import mysql2 with promise support
import mysql from "mysql2/promise";
// Import dotenv to read environment variables from .env file
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

// Create a MySQL connection pool using environment variables
export const pool = mysql.createPool({
  host: process.env.DB_HOST,       // Database host
  database: process.env.DB_NAME,   // Database name
  port: 3306,                      // Default MySQL port
  user: process.env.DB_USER,       // Database user
  password: process.env.DB_PASS,   // Database password
  connectionLimit: 5,              //  Match Clever Cloud limit
  waitForConnections: true,        // Queue new connections if pool is full
  queueLimit: 0                    // 0 = no limit for queued connections
});

// Test the connection when the server starts
async function tryConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("  Successfully connected to the database");
    connection.release(); // Release connection back to the pool
  } catch (error) {
    console.error(`  Database connection error: ${error.message}`);
  }
}

// Run test connection
tryConnection();
