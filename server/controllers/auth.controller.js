// ================================
// Auth Controller
// Handles user registration and login
// ================================

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../connection_db.js";
import { sendSuccess, sendError } from "../utils/response.js";

// ================================
// Generate JWT token
// ================================
function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      role: user.role,
      id_authorized_point: user.id_authorized_point || null,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
}

// ================================
// REGISTER (Patients only)
// ================================
export async function register(req, res) {
  try {
    const {
      name,
      document_type,
      document_number,
      phone,
      eps,
      email,
      password,
    } = req.body;

    if (!name || !document_type || !document_number || !phone || !eps || !email || !password) {
      return sendError(res, "All fields are required", 400);
    }

    // Check if email already exists
    const [existing] = await pool.query("SELECT id_user FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return sendError(res, "Email already registered", 400);
    }

    // Find EPS ID
    const [epsRow] = await pool.query(
      "SELECT id_eps FROM eps WHERE TRIM(LOWER(name_eps)) = TRIM(LOWER(?))",
      [eps]
    );
    if (epsRow.length === 0) {
      return sendError(res, `EPS '${eps}' not found in database`, 400);
    }
    const epsId = epsRow[0].id_eps;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new patient user
    const [result] = await pool.query(
      `INSERT INTO users (full_name, document_type, document_number, phone, email, password_hash, id_eps)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, document_type, document_number, phone, email, hashedPassword, epsId]
    );

    const user = {
      id: result.insertId,
      full_name: name, //  always use full_name
      email,
      role: "PACIENTE",
    };

    const token = generateToken(user);

    return sendSuccess(res, { token, user }, "User registered successfully", 201);
  } catch (error) {
    console.error("Register error:", error);
    sendError(res, "Server error during registration", 500);
  }
}

// ================================
// LOGIN (Patients + Pharmacists)
// ================================
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, "Email and password are required", 400);
    }

    let user = null;

    // Try login as patient
    const [patients] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (patients.length > 0) {
      const patient = patients[0];
      const valid = await bcrypt.compare(password, patient.password_hash);
      if (!valid) return sendError(res, "Invalid credentials", 401);

      user = {
        id: patient.id_user,
        full_name: patient.full_name, //  always full_name
        email: patient.email,
        role: "PACIENTE",
      };
    }

    // Try login as pharmacist
    if (!user) {
      const [pharmacists] = await pool.query("SELECT * FROM pharmacists WHERE email = ?", [email]);
      if (pharmacists.length > 0) {
        const pharm = pharmacists[0];

        user = {
          id: pharm.id_pharmacist,
          full_name: pharm.name, //  map to full_name
          email: pharm.email,
          role: "FARMACEUTICO",
          id_authorized_point: pharm.id_authorized_point,
        };
      }
    }

    if (!user) {
      return sendError(res, "User not found", 404);
    }

    const token = generateToken(user);

    return sendSuccess(res, { token, user }, "Login successful", 200);
  } catch (error) {
    console.error("Login error:", error);
    sendError(res, "Server error during login", 500);
  }
}
