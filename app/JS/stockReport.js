// app/stockReport.js
import { pool } from "../../server/connection_db.js";

/**
 * Generate stock report by authorized point
 * @param {number} id_authorized_point - The ID of the authorized point
 * @returns {Promise<Array>} Stock report for the given point
 */
export async function stockReportByAP(id_authorized_point) {
  try {
    const sql = `
      SELECT 
        ap.id_authorized_point,
        ap.name AS authorized_point,
        ap.city,
        m.id_medicine,
        m.name AS medicine_name,
        i.quantity,
        i.stock
      FROM inventories i
      INNER JOIN authorized_points ap 
        ON i.id_authorized_point = ap.id_authorized_point
      INNER JOIN medicines m 
        ON i.id_medicine = m.id_medicine
      WHERE ap.id_authorized_point = ?;
    `;

    const [rows] = await pool.query(sql, [id_authorized_point]);

    if (rows.length === 0) {
      console.log(" No stock found for this authorized point.");
      return [];
    }

    console.log(` Stock report for authorized point ${id_authorized_point}:`, rows);
    return rows;
  } catch (error) {
    console.error(" Error generating stock report:", error.message);
    throw error;
  }
}
