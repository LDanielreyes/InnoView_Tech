// app/manageAuthorizedPoint.js
import { pool } from "../server/connection_db.js";

/**
 * Update an authorized point by ID
 * @param {number} id_authorized_point - The ID of the authorized point
 * @param {Object} data - Fields to update
 * @param {string} [data.name] - Updated name
 * @param {string} [data.address] - Updated address
 * @param {string} [data.city] - Updated city
 * @returns {Promise<boolean>} True if updated, false otherwise
 */
export async function updateAuthorizedPoint(id_authorized_point, data) {
  try {
    const sql = `
      UPDATE authorized_points 
      SET name = ?, address = ?, city = ?, updated_at = NOW()
      WHERE id_authorized_point = ?;
    `;

    const [result] = await pool.query(sql, [
      data.name,
      data.address,
      data.city,
      id_authorized_point,
    ]);

    if (result.affectedRows === 0) {
      console.log(" No authorized point found to update.");
      return false;
    }

    console.log(` Authorized point ${id_authorized_point} updated.`);
    return true;
  } catch (error) {
    console.error(" Error updating authorized point:", error.message);
    throw error;
  }
}

/**
 * Delete an authorized point by ID
 * @param {number} id_authorized_point - The ID of the authorized point
 * @returns {Promise<boolean>} True if deleted, false otherwise
 */
export async function deleteAuthorizedPoint(id_authorized_point) {
  try {
    const sql = `
      DELETE FROM authorized_points 
      WHERE id_authorized_point = ?;
    `;

    const [result] = await pool.query(sql, [id_authorized_point]);

    if (result.affectedRows === 0) {
      console.log(" No authorized point found to delete.");
      return false;
    }

    console.log(` Authorized point ${id_authorized_point} deleted.`);
    return true;
  } catch (error) {
    console.error(" Error deleting authorized point:", error.message);
    throw error;
  }
}
