// Import dependencies
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Import routes
import authRoutes from "./routes/auth.routes.js";
import medicineRoutes from "./routes/medicines.routes.js";
import inventoryRoutes from "./routes/inventory.routes.js";

dotenv.config(); // Load environment variables

const app = express();

// Middlewares
app.use(cors());             // Enable CORS
app.use(express.json());     // Parse JSON request body

// API Routes
app.use("/auth", authRoutes);          // Register + Login
app.use("/medicines", medicineRoutes); // Medicines search
app.use("/inventory", inventoryRoutes);// Pharmacist inventory

// Health check route
app.get("/", (req, res) => {
  res.json({ message: " API is running correctly" });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
