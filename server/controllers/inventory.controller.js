// ================================
// Inventory Controller
// Handles pharmacist inventory CRUD
// ================================

import { pool } from "../connection_db.js";
import { sendSuccess, sendError } from "../utils/response.js";

// ---------------- Get inventory (pharmacist only) ----------------
export async function getInventory(req, res) {
  try {
    if (req.user.role !== "FARMACEUTICO") {
      return sendError(res, "Access denied", 403);
    }

    const [rows] = await pool.query(
      `SELECT 
         i.id_inventory,
         i.id_medicine,
         m.name AS medicine,
         i.quantity,
         i.created_at,
         i.updated_at
       FROM inventories i
       JOIN medicines m ON i.id_medicine = m.id_medicine
       WHERE i.id_authorized_point = ?`,
      [req.user.id_authorized_point]
    );

    return sendSuccess(res, rows, "Inventory fetched successfully");
  } catch (error) {
    console.error("Error getting inventory:", error);
    return sendError(res, "Server error while fetching inventory", 500);
  }
}

// ---------------- Add medicine ----------------
export async function addMedicine(req, res) {
  try {
    const { id_medicine, quantity } = req.body;
    if (!id_medicine || !quantity) {
      return sendError(res, "id_medicine and quantity are required", 400);
    }

    await pool.query(
      `INSERT INTO inventories (id_authorized_point, id_medicine, quantity)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE quantity = VALUES(quantity)`,
      [req.user.id_authorized_point, id_medicine, quantity]
    );

    return sendSuccess(res, null, "Medicine added/updated");
  } catch (error) {
    console.error("Error adding medicine:", error);
    return sendError(res, "Server error while adding medicine", 500);
  }
}

// ---------------- Update medicine quantity ----------------
export async function updateMedicine(req, res) {
  try {
    const { quantity } = req.body;
    const { id } = req.params;
    if (!quantity) {
      return sendError(res, "Quantity is required", 400);
    }

    await pool.query(
      `UPDATE inventories
       SET quantity = ?
       WHERE id_inventory = ? AND id_authorized_point = ?`,
      [quantity, id, req.user.id_authorized_point]
    );

    return sendSuccess(res, null, "Medicine updated");
  } catch (error) {
    console.error("Error updating medicine:", error);
    return sendError(res, "Server error while updating medicine", 500);
  }
}

// ---------------- Delete medicine ----------------
export async function deleteMedicine(req, res) {
  try {
    const { id } = req.params;

    await pool.query(
      `DELETE FROM inventories
       WHERE id_inventory = ? AND id_authorized_point = ?`,
      [id, req.user.id_authorized_point]
    );

    return sendSuccess(res, null, "Medicine deleted");
  } catch (error) {
    console.error("Error deleting medicine:", error);
    return sendError(res, "Server error while deleting medicine", 500);
  }
}
