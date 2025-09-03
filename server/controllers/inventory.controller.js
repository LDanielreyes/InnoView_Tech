// ================================
// Inventory Controller
// ================================

import { pool } from "../connection_db.js";
import { sendSuccess, sendError } from "../utils/response.js";

// ---------------- GET INVENTORY ----------------
export async function getInventory(req, res) {
  try {
    const [rows] = await pool.query(
      `SELECT i.id_inventory, m.name AS medicine, i.quantity, i.created_at
       FROM inventories i
       JOIN medicines m ON i.id_medicine = m.id_medicine
       WHERE i.id_authorized_point = ?`,
      [req.user.id_authorized_point] // 👈 comes from login pharmacist
    );

    return sendSuccess(res, rows, "Inventory fetched successfully");
  } catch (error) {
    console.error("getInventory error:", error);
    return sendError(res, "Error fetching inventory", 500);
  }
}

// ---------------- ADD MEDICINE ----------------
export async function addMedicine(req, res) {
  try {
    const { medicine, quantity } = req.body;

    if (!medicine || !quantity) {
      return sendError(res, "Medicine name and quantity are required", 400);
    }

    // 1. Check if medicine exists
    let [rows] = await pool.query(
      "SELECT id_medicine FROM medicines WHERE name = ?",
      [medicine]
    );

    let id_medicine;
    if (rows.length > 0) {
      id_medicine = rows[0].id_medicine;
    } else {
      // Insert new medicine
      const [result] = await pool.query(
        "INSERT INTO medicines (name) VALUES (?)",
        [medicine]
      );
      id_medicine = result.insertId;
    }

    // 2. Insert into inventory (or update if exists)
    await pool.query(
      `INSERT INTO inventories (id_authorized_point, id_medicine, quantity)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE quantity = VALUES(quantity)`,
      [req.user.id_authorized_point, id_medicine, quantity]
    );

    return sendSuccess(res, null, "Medicine added to inventory");
  } catch (error) {
    console.error("addMedicine error:", error);
    return sendError(res, "Error adding medicine", 500);
  }
}

// ---------------- UPDATE MEDICINE ----------------
export async function updateMedicine(req, res) {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity) {
      return sendError(res, "Quantity is required", 400);
    }

    const [result] = await pool.query(
      "UPDATE inventories SET quantity = ? WHERE id_inventory = ?",
      [quantity, id]
    );

    if (result.affectedRows === 0) {
      return sendError(res, "Medicine not found in inventory", 404);
    }

    return sendSuccess(res, null, "Medicine updated successfully");
  } catch (error) {
    console.error("updateMedicine error:", error);
    return sendError(res, "Error updating medicine", 500);
  }
}

// ---------------- DELETE MEDICINE ----------------
export async function deleteMedicine(req, res) {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      "DELETE FROM inventories WHERE id_inventory = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return sendError(res, "Medicine not found in inventory", 404);
    }

    return sendSuccess(res, null, "Medicine deleted successfully");
  } catch (error) {
    console.error("deleteMedicine error:", error);
    return sendError(res, "Error deleting medicine", 500);
  }
}

// ---------------- SEARCH MEDICINE IN INVENTORY ----------------
export async function searchInventory(req, res) {
  try {
    const { name } = req.query;

    if (!name) {
      return sendError(res, "Missing search parameter 'name'", 400);
    }

    const [rows] = await pool.query(
      `SELECT i.id_inventory, m.name AS medicine, i.quantity, i.created_at
       FROM inventories i
       JOIN medicines m ON i.id_medicine = m.id_medicine
       WHERE i.id_authorized_point = ? 
       AND m.name LIKE ?`,
      [req.user.id_authorized_point, `%${name}%`]
    );

    return sendSuccess(res, rows, "Search completed successfully");
  } catch (error) {
    console.error("searchInventory error:", error);
    return sendError(res, "Error searching inventory", 500);
  }
}
