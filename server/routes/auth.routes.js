// ================================
// Auth Routes
// ================================

import { Router } from "express";
import { register, login } from "../controllers/auth.controller.js";

// Create Express Router
const router = Router();

// -------------------- REGISTER --------------------
// Patients use this endpoint to create an account
// POST http://localhost:3000/api/auth/register
router.post("/register", register);

// -------------------- LOGIN --------------------
// Patients + Pharmacists use this endpoint
// POST http://localhost:3000/api/auth/login
router.post("/login", login);

// Export router
export default router;
