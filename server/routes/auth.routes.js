// ==================================
// Auth Routes
// ==================================

import { Router } from "express";
import { register, login } from "../controllers/auth.controller.js";

// Create Express Router
const router = Router();

// -------------------- REGISTER --------------------
// Patients will use this endpoint to create an account
// POST http://localhost:3000/auth/register
router.post("/register", register);

// -------------------- LOGIN --------------------
// Both patients and pharmacists will use this endpoint
// POST http://localhost:3000/auth/login
router.post("/login", login);

// Export router as default (required for index.js import)
export default router;
