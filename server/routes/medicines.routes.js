// ================================
// Medicines Routes
// ================================

import { Router } from "express";
import { getMedicines, searchMedicine } from "../controllers/medicines.controller.js";

const router = Router();

// -------------------- GET ALL MEDICINES --------------------
// Example: GET http://localhost:3000/api/medicines
router.get("/", getMedicines);

// -------------------- SEARCH MEDICINE --------------------
// Example: GET http://localhost:3000/api/medicines/search?name=Ibuprofeno&eps=SURA
router.get("/search", searchMedicine);

export default router;
