// app/filterMedicines.js
import { pool } from "../../../server/connection_db.js";

/**
 * Filter medicines by availability
 * @param {boolean} onlyAvailable - If true, only return available medicines
 * @returns {Promise<Array>} List of medicines (with availability info)
 */
export async function filterMedicinesByAvailability(onlyAvailable = false) {
  try {
    let sql = `
      SELECT 
        m.id_medicine,
        m.name AS medicine_name,
        i.id_authorized_point,
        i.quantity,
        i.stock
      FROM medicines m
      INNER JOIN inventories i 
        ON m.id_medicine = i.id_medicine
    `;

    if (onlyAvailable) {
      sql += ` WHERE i.quantity > 0 AND i.stock = 'Available'`;
    }

    const [rows] = await pool.query(sql);

    if (rows.length === 0) {
      console.log("No medicines found with the current filter.");
      return [];
    }

    console.log(`Found ${rows.length} medicines`);
    return rows;

  } catch (error) {
    console.error("Error filtering medicines:", error.message);
    throw error;
  }
}
