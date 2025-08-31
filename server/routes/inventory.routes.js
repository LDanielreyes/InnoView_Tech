// server/routes/inventory.routes.js
import { Router } from "express";
import { verifyToken } from "../middleware/auth.middleware.js"; // ✅ Correct path (singular)

// Import inventory controllers
import {
  getInventory,
  addMedicine,
  updateMedicine,
  deleteMedicine,
} from "../controllers/inventory.controller.js";

const router = Router();

// All routes require JWT authentication
router.use(verifyToken);

// CRUD routes for inventory (pharmacist only)
router.get("/", getInventory);       // Get inventory
router.post("/", addMedicine);       // Add medicine
router.put("/:id", updateMedicine);  // Update medicine
router.delete("/:id", deleteMedicine); // Delete medicine

export default router;
