// Import dependencies
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../connection_db.js";

// Generate JWT token
function generateToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" } // Token valid for 1 hour
  );
}

// ---------------- REGISTER (Patients only) ----------------
export async function register(req, res) {
  try {
    const { name, document_type, document_number, phone, eps, email, password } = req.body;

    // Basic validation
    if (!name || !document_type || !document_number || !phone || !eps || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Check if email already exists
    const [existing] = await pool.query("SELECT id_user FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into DB
    const [result] = await pool.query(
      `INSERT INTO users (full_name, document_type, document_number, phone, email, password_hash, id_eps)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, document_type, document_number, phone, email, hashedPassword, eps]
    );

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      userId: result.insertId
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ success: false, message: "Server error during registration" });
  }
}

// ---------------- LOGIN (Patients + Pharmacists) ----------------
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    let user = null;
    let role = null;

    // 1. Try to find user in patients (users table)
    const [patients] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (patients.length > 0) {
      const patient = patients[0];
      const valid = await bcrypt.compare(password, patient.password_hash);
      if (!valid) return res.status(401).json({ success: false, message: "Invalid credentials" });

      user = {
        id: patient.id_user,
        full_name: patient.full_name,
        email: patient.email,
        role: "PACIENTE"
      };
    }

    // 2. If not found in patients, try pharmacists
    if (!user) {
      const [pharmacists] = await pool.query("SELECT * FROM pharmacists WHERE email = ?", [email]);
      if (pharmacists.length > 0) {
        const pharm = pharmacists[0];
        const valid = await bcrypt.compare(password, pharm.password_hash);
        if (!valid) return res.status(401).json({ success: false, message: "Invalid credentials" });

        user = {
          id: pharm.id_pharmacists,
          full_name: pharm.full_name,
          email: pharm.email,
          role: "FARMACEUTICO"
        };
      }
    }

    // 3. If still not found → error
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Generate JWT
    const token = generateToken(user);

    return res.json({
      success: true,
      user: { ...user, token }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Server error during login" });
  }
}
