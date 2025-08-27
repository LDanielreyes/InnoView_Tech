// Import necessary modules: fs for reading files, path for handling routes, csv-parser for parsing CSV, and the database connection pool
import fs from "fs";
import path from "path";
import csv from "csv-parser";
import { pool } from "../connection_db.js";

export async function loadEPS() {
  const archiveRoute = path.resolve("server/data/eps.csv"); // Wouldn't 'filePath' be clearer than 'archiveRoute'?
  const EPS = []; // Array to store parsed bills

  // Promise to handle the asynchronous flow of the stream and database insertion
  return new Promise((resolve, reject) => {
    // Create a stream to read the CSV
    fs.createReadStream(archiveRoute)
      .pipe(csv()) // Parse the CSV with csv-parser, very practical
      .on("data", (row) => {
        // Push data to the array in the order of the table columns
        EPS.push([
          parseInt(row.id_eps),
          row.name_eps,
          row.created_at,
          row.updated_at
        ]);
      })
      .on("end", async () => {
        try {
          // Query to insert multiple rows at once, efficient with the array of arrays
          const sql = `INSERT INTO eps (id_eps,name_eps,created_at,updated_at) VALUES ?`;
          const [result] = await pool.query(sql, [EPS]); // Using the pool, good practice for connections
          console.log(`Inserted ${result.affectedRows} EPS`); // Clear feedback on how many rows were inserted
          resolve(); // Everything went well, resolve the promise
        } catch (error) {
          // Error handling for insertion, solid
          console.error(`Error adding EPS: ${error.message}`);
          reject(error);
        }
      })
      .on("error", (err) => {
        // Catch errors when reading the CSV, like file not found
        console.error(`Error reading CSV file: ${err.message}`);
        reject(err);
      });
  });
}