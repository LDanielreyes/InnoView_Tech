import fs from "fs";
import path from "path";
import csv from "csv-parser";
import { pool } from "../connection_db.js";

export async function loadInventories() {
  const filePath = path.resolve("server/data/inventories.csv");
  const inventories = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        inventories.push([
          parseInt(row.id_authorized_point),
          parseInt(row.id_medicine),
          parseInt(row.quantity),
          row.stock,
          row.created_at,
          row.updated_at
        ]);
      })
      .on("end", async () => {
        try {
          const sql = `INSERT INTO inventories 
            (id_authorized_point, id_medicine, quantity, stock, created_at, updated_at) VALUES ?`;
          const [result] = await pool.query(sql, [inventories]);
          console.log(`Inserted ${result.affectedRows} inventories`);
          resolve();
        } catch (error) {
          console.error(`Error adding inventories: ${error.message}`);
          reject(error);
        }
      })
      .on("error", (err) => {
        console.error(`Error reading CSV file: ${err.message}`);
        reject(err);
      });
  });
}
