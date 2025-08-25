// Import necessary modules: fs for reading files, path for handling routes, csv-parser for parsing CSV, and the database connection pool
import fs from "fs";
import path from "path";
import csv from "csv-parser";
import { pool } from "../connection_db.js";

export async function loadMedicines() {
  const archiveRoute = path.resolve("server/data/medicines.csv"); // Wouldn't 'filePath' be clearer than 'archiveRoute'?
  const bills = []; // Array to store parsed bills

  // Promise to handle the asynchronous flow of the stream and database insertion
  return new Promise((resolve, reject) => {
    // Create a stream to read the CSV
    fs.createReadStream(archiveRoute)
      .pipe(csv()) // Parse the CSV with csv-parser, very practical
      .on("data", (row) => {
        // Push data to the array in the order of the table columns
        bills.push([
          row.id_medicine,
          row.name,
        ]);
      })
      .on("end", async () => {
        try {
          // If no valid bills, warn and resolve the promise
          if (bills.length === 0) {
            console.warn("No valid bills to insert"); // Maybe a clearer return message for the caller?
            resolve();
            return;
          }
          // Query to insert multiple rows at once, efficient with the array of arrays
          const sql = `INSERT INTO bills (bill_number, id_transaction, period, platform, invoiced_amount, paid_amount) VALUES ?`;
          const [result] = await pool.query(sql, [bills]); // Using the pool, good practice for connections
          console.log(`Inserted ${result.affectedRows} bills`); // Clear feedback on how many rows were inserted
          resolve(); // Everything went well, resolve the promise
        } catch (error) {
          // Error handling for insertion, solid
          console.error(`Error adding bills: ${error.message}`);
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