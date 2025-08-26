// Import necessary modules: fs for reading files, path for handling routes, csv-parser for parsing CSV, and the database connection pool
import fs from "fs";
import path from "path";
import csv from "csv-parser";
import { pool } from "../connection_db.js";

export async function loadMedicines() {
  const archiveRoute = path.resolve("server/data/medicines.csv"); // Wouldn't 'filePath' be clearer than 'archiveRoute'?
  const medicines = []; // Array to store parsed bills

  // Promise to handle the asynchronous flow of the stream and database insertion
  return new Promise((resolve, reject) => {
    // Create a stream to read the CSV
    fs.createReadStream(archiveRoute)
      .pipe(csv()) // Parse the CSV with csv-parser, very practical
      .on("data", (row) => {
        // Push data to the array in the order of the table columns
        medicines.push([
          parseInt(row.id_medicine),
          row.name,
          row.quantity,
          row.created_at,
          row.updated_at
        ]);
      })
      .on("end", async () => {
        try {
          // If no valid bills, warn and resolve the promise
          if (medicines.length === 0) {
            console.warn("No valid medicines to insert"); // Maybe a clearer return message for the caller?
            resolve();
            return;
          }
          // Query to insert multiple rows at once, efficient with the array of arrays
          const sql = `INSERT INTO medicines (id_medicine,name,quantity,created_at,updated_at) VALUES ?`;
          const [result] = await pool.query(sql, [medicines]); // Using the pool, good practice for connections
          console.log(`Inserted ${result.affectedRows} medicines`); // Clear feedback on how many rows were inserted
          resolve(); // Everything went well, resolve the promise
        } catch (error) {
          // Error handling for insertion, solid
          console.error(`Error adding medicines: ${error.message}`);
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