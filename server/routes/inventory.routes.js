// ================================
// Inventory Routes
// ================================

import { Router } from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import {
  getInventory,
  addMedicine,
  updateMedicine,
  deleteMedicine,
} from "../controllers/inventory.controller.js";

const router = Router();

// ✅ Todas las rutas requieren autenticación con token
router.use(verifyToken);

// ---------------- CRUD ----------------
router.get("/", getInventory);        // GET    /api/inventory
router.post("/", addMedicine);        // POST   /api/inventory
router.put("/:id", updateMedicine);   // PUT    /api/inventory/:id
router.delete("/:id", deleteMedicine); // DELETE /api/inventory/:id

export default router;
