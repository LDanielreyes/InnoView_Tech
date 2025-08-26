import fs from "fs";
import path from "path";
import csv from "csv-parser";
import { pool } from "../connection_db.js";

export async function loadUsers() {
  const filePath = path.resolve("server/data/users.csv");
  const users = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        users.push([
          parseInt(row.id_eps),
          row.name,
          row.document_type,
          row.email,
          row.created_at,
          row.updated_at
        ]);
      })
      .on("end", async () => {
        try {
          const sql = `INSERT INTO users (id_eps, name, document_type, email, created_at, updated_at) VALUES ?`;
          const [result] = await pool.query(sql, [users]);
          console.log(`Inserted ${result.affectedRows} users`);
          resolve();
        } catch (error) {
          console.error(`Error adding users: ${error.message}`);
          reject(error);
        }
      })
      .on("error", (err) => {
        console.error(`Error reading users CSV file: ${err.message}`);
        reject(err);
      });
  });
}
