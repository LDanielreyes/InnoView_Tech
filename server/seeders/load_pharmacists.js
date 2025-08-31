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
        const idPharmacist = row.id_pharmacist && row.id_pharmacist.trim() !== "" 
          ? parseInt(row.id_pharmacist.trim()) 
          : null;

        const idAuthorizedPoint = row.id_authorized_point && row.id_authorized_point.trim() !== "" 
          ? parseInt(row.id_authorized_point.trim()) 
          : null;

        pharmacists.push([
          idPharmacist,
          idAuthorizedPoint,
          row.name?.trim() || null,
          row.email?.trim() || null,
          row.password_hash?.trim() || null,
          row.created_at?.trim() || null,
          row.updated_at?.trim() || null
        ]);
      })
      .on("end", async () => {
        try {
          const sql = `
            INSERT INTO pharmacists 
            (id_pharmacist, id_authorized_point, name, email, password_hash, created_at, updated_at) 
            VALUES ?`;

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
