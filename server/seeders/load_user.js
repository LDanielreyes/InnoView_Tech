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
          parseInt(row.id_user),
          parseInt(row.id_eps),
          row.full_name,
          row.document_type,
          row.document_number,
          row.email,
          row.phone,
          row.password_hash,
          row.created_at,
          row.updated_at
        ]);
      })
      .on("end", async () => {
        try {
          const sql = `INSERT INTO users (id_user,id_eps,full_name,document_type,document_number,email,phone,password_hash,created_at,updated_at) VALUES ?`;
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
