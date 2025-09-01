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
import inventoryRoutes from "./routes/inventory.routes.js";

dotenv.config();
const app = express();

// ================================
// Middlewares
// ================================
app.use(cors());
app.use(express.json());

// ================================
// Routes (todas con prefijo /api)
// ================================
app.use("/api/auth", authRoutes);            // Auth (register, login)
app.use("/api/medicines", medicineRoutes);   // Medicines (list, search)
app.use("/api/inventory", inventoryRoutes);  // Inventory (CRUD for pharmacists)

// ================================
// Health check
// ================================
app.get("/", (req, res) => {
  res.json({ message: "API is running correctly " });
});

// ================================
// Test DB connection
// ================================
app.get("/api/ping", async (req, res) => {
  try {
    const [result] = await pool.query("SELECT 1+1 AS result");
    res.json(result[0]); // { "result": 2 }
  } catch (error) {
    console.error("DB connection error:", error);
    res.status(500).json({ error: "Database not reachable" });
  }
});

// ================================
// Legacy endpoint (search medicine by EPS)
// ================================
app.get("/api/search_medicine", async (req, res) => {
  try {
    const { medicine_name, eps_id } = req.query;
    if (!medicine_name || !eps_id) {
      return res
        .status(400)
        .json({ error: "medicine_name and eps_id are required" });
    }

    const query = `
      SELECT 
        ap.point_name AS point_name,
        ap.address,
        ap.latitude,
        ap.longitude,
        i.quantity
      FROM inventories i
      JOIN medicines m ON i.id_medicine = m.id_medicine
      JOIN authorized_points ap ON i.id_authorized_point = ap.id_authorized_point
      WHERE m.name = ? 
        AND ap.id_eps = ? 
        AND i.quantity > 0
    `;

    const [rows] = await pool.query(query, [medicine_name, eps_id]);

    if (!rows.length) {
      return res
        .status(404)
        .json({ message: "No medicine found in the authorized points of this EPS" });
    }

    res.json(rows);
  } catch (err) {
    console.error("Error searching medicine:", err);
    res.status(500).json({ error: "Server error while searching medicine" });
  }
});

// ================================
// Fallback para rutas no definidas
// ================================
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// ================================
// Server
// ================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
