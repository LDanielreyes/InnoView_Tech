// server/routes/medicines.routes.js
import { Router } from "express";
import { getMedicines, searchMedicine } from "../controllers/medicines.controller.js";

const router = Router();

// ---------------- Medicines Routes ----------------

// Get all medicines
// Example: GET http://localhost:3000/medicines
router.get("/", getMedicines);

// Search medicine by name and EPS
// Example: GET http://localhost:3000/medicines/search?name=Ibuprofeno&eps=SURA
router.get("/search", searchMedicine);

export default router;
