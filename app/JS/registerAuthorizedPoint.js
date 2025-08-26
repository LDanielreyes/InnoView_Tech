// app/registerAuthorizedPoint.js
import { pool } from "../../server/connection_db.js";

/**
 * Register a new authorized point
 * @param {number} id_eps - EPS ID related to the authorized point
 * @param {string} name - Authorized point name
 * @param {string} address - Authorized point address
 * @param {string} city - Authorized point city
 * @returns {Promise<Object>} Newly created authorized point
 */
export async function registerAuthorizedPoint(id_eps, name, address, city) {
  try {
    const sql = `
      INSERT INTO authorized_points 
      (id_eps, name, address, city, created_at, updated_at)
      VALUES (?, ?, ?, ?, NOW(), NOW());
    `;

    const [result] = await pool.query(sql, [id_eps, name, address, city]);

    console.log(" New authorized point created with ID:", result.insertId);

    return {
      id_authorized_point: result.insertId,
      id_eps,
      name,
      address,  
      city,
    };
  } catch (error) {
    console.error(" Error creating authorized point:", error.message);
    throw error;
  }
}
