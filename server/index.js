// ================================
// Import dependencies
// ================================
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Import DB connection
import { pool } from "./connection_db.js";

// Import routes
import authRoutes from "./routes/auth.routes.js";
import medicineRoutes from "./routes/medicines.routes.js";
import inventoryRoutes from "./routes/inventory.routes.js"; // Inventory routes

// ================================
// Config
// ================================
dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// ================================
// Routes
// ================================
app.use("/auth", authRoutes);          // Auth (register, login)
app.use("/medicines", medicineRoutes); // Medicines (list, search)
app.use("/inventory", inventoryRoutes); // Inventory (CRUD for pharmacists)

// Health check
app.get("/", (req, res) => {
  res.json({ message: "API is running correctly " });
});

// Test DB connection
app.get("/ping", async (req, res) => {
  try {
    const [result] = await pool.query("SELECT 1+1 AS result");
    res.json(result[0]); // { "result": 2 }
  } catch (error) {
    console.error("DB connection error:", error);
    res.status(500).json({ error: "Database not reachable" });
  }
});

// ================================
// Server
// ================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
