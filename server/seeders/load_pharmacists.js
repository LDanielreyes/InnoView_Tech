import fs from "fs";
import path from "path";
import csv from "csv-parser";
import { pool } from "../connection_db.js";

export async function loadPharmacists() {
  const filePath = path.resolve("server/data/pharmacists.csv");
  const pharmacists = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        pharmacists.push([
          parseInt(row.id_pharmacist),
          parseInt(row.id_authorized_point),
          row.password_hash,
          row.name,
          row.email,
          row.created_at,
          row.updated_at
        ]);
      })
      .on("end", async () => {
        try {
          const sql = `INSERT INTO pharmacists (id_pharmacist,id_authorized_point,name,email,password_hash,created_at,updated_at) VALUES ?`;
          const [result] = await pool.query(sql, [pharmacists]);
          console.log(`Inserted ${result.affectedRows} pharmacists`);
          resolve();
        } catch (error) {
          console.error(`Error adding pharmacists: ${error.message}`);
          reject(error);
        }
      })
      .on("error", (err) => {
        console.error(`Error reading pharmacists CSV file: ${err.message}`);
        reject(err);
      });
  });
}
