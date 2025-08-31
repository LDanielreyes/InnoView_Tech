// ================================
// Medicines Controller
// Handles medicine queries
// ================================

import { pool } from "../connection_db.js";
import { sendSuccess, sendError } from "../utils/response.js";

// ---------------- Get all medicines ----------------
export async function getMedicines(req, res) {
  try {
    const [rows] = await pool.query("SELECT * FROM medicines");
    return sendSuccess(res, rows, "Medicines fetched successfully");
  } catch (error) {
    console.error("Error getting medicines:", error);
    return sendError(res, "Server error while fetching medicines", 500);
  }
}

// ---------------- Search medicine by name + EPS ----------------
export async function searchMedicine(req, res) {
  try {
    const { name, eps } = req.query;

    if (!name || !eps) {
      return sendError(res, "Medicine name and EPS are required", 400);
    }

    const query = `
      SELECT 
        ap.point_name,
        ap.address,
        ap.city,
        ap.latitude,
        ap.longitude,
        i.quantity,
        m.name AS medicine_name
      FROM inventories i
      INNER JOIN medicines m ON i.id_medicine = m.id_medicine
      INNER JOIN authorized_points ap ON i.id_authorized_point = ap.id_authorized_point
      INNER JOIN eps e ON ap.id_eps = e.id_eps
      WHERE m.name LIKE ? 
        AND e.name_eps = ? 
        AND i.quantity > 0
    `;

    const [rows] = await pool.query(query, [`%${name}%`, eps]);

    if (rows.length === 0) {
      return sendError(res, "No results found", 404);
    }

    return sendSuccess(res, rows, "Medicine search results");
  } catch (error) {
    console.error("Error searching medicine:", error);
    return sendError(res, "Server error while searching medicine", 500);
  }
}
