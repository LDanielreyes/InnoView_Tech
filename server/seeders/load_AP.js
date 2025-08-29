// Import necessary modules: fs for reading files, path for handling routes, csv-parser for parsing CSV, and the database connection pool
import fs from "fs";
import path from "path";
import csv from "csv-parser";
import { pool } from "../connection_db.js";

export async function loadAP() {
  const archiveRoute = path.resolve("server/data/authorized_points.csv"); // Wouldn't 'filePath' be clearer than 'archiveRoute'?
  const AP = []; // Array to store parsed bills

  // Promise to handle the asynchronous flow of the stream and database insertion
  return new Promise((resolve, reject) => {
    // Create a stream to read the CSV
    fs.createReadStream(archiveRoute)
      .pipe(csv()) // Parse the CSV with csv-parser, very practical
      .on("data", (row) => {
        // Push data to the array in the order of the table columns
        AP.push([
          parseInt(row.id_authorized_point),
          parseInt(row.id_eps),
          row.point_name,
          row.address,
          row.city,
          row.created_at,
          row.updated_at
        ]);
      })
      .on("end", async () => {
        try {
          // Query to insert multiple rows at once, efficient with the array of arrays
          const sql = `INSERT INTO authorized_points (id_authorized_point,id_eps,point_name,address,city,created_at,updated_at) VALUES ?`;
          const [result] = await pool.query(sql, [AP]); // Using the pool, good practice for connections
          console.log(`Inserted ${result.affectedRows} AP`); // Clear feedback on how many rows were inserted
          resolve(); // Everything went well, resolve the promise
        } catch (error) {
          // Error handling for insertion, solid
          console.error(`Error adding AP: ${error.message}`);
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