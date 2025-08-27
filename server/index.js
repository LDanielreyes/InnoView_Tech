import express from "express";
import { pool } from "./connection_db.js";

const app = express();
app.use(express.json());

/* -------------------- ERROR HANDLER -------------------- */
const handleError = (res, err) => {
  console.error(err);
  res.status(500).json({ error: "Server error" });
};

/* -------------------- EPS -------------------- */
app.get("/eps", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM eps");
    res.json(rows);
  } catch (err) {
    handleError(res, err);
  }
});

app.get("/eps/:id", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM eps WHERE id_eps = ?", [req.params.id]);
    res.json(rows[0] || {});
  } catch (err) {
    handleError(res, err);
  }
});

app.post("/eps", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || typeof name !== "string" || !name.trim()) 
      return res.status(400).json({ error: "EPS name must be a non-empty string" });

    const [existing] = await pool.query("SELECT 1 FROM eps WHERE name = ?", [name]);
    if (existing.length) return res.status(400).json({ error: "EPS already exists" });

    const [result] = await pool.query("INSERT INTO eps (name) VALUES (?)", [name]);
    res.status(201).json({ id: result.insertId, name });
  } catch (err) {
    handleError(res, err);
  }
});

app.put("/eps/:id", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || typeof name !== "string" || !name.trim()) 
      return res.status(400).json({ error: "EPS name must be a non-empty string" });

    await pool.query("UPDATE eps SET name = ? WHERE id_eps = ?", [name, req.params.id]);
    res.json({ message: "EPS updated" });
  } catch (err) {
    handleError(res, err);
  }
});

app.delete("/eps/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM eps WHERE id_eps = ?", [req.params.id]);
    res.json({ message: "EPS deleted" });
  } catch (err) {
    handleError(res, err);
  }
});

/* -------------------- MEDICINES -------------------- */
app.get("/medicines", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM medicines");
    res.json(rows);
  } catch (err) {
    handleError(res, err);
  }
});

app.get("/medicines/:id", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM medicines WHERE id_medicine = ?", [req.params.id]);
    res.json(rows[0] || {});
  } catch (err) {
    handleError(res, err);
  }
});

app.post("/medicines", async (req, res) => {
  try {
    const { name, quantity } = req.body;
    if (!name || typeof name !== "string" || !name.trim()) 
      return res.status(400).json({ error: "Medicine name must be a non-empty string" });
    if (typeof quantity !== "number" || quantity < 0) 
      return res.status(400).json({ error: "Quantity must be a non-negative number" });

    const [existing] = await pool.query("SELECT 1 FROM medicines WHERE name = ?", [name]);
    if (existing.length) return res.status(400).json({ error: "Medicine already exists" });

    const [result] = await pool.query("INSERT INTO medicines (name, quantity) VALUES (?, ?)", [name, quantity]);
    res.status(201).json({ id: result.insertId, name, quantity });
  } catch (err) {
    handleError(res, err);
  }
});

app.put("/medicines/:id", async (req, res) => {
  try {
    const { name, quantity } = req.body;
    if (!name || typeof name !== "string" || !name.trim()) 
      return res.status(400).json({ error: "Medicine name must be a non-empty string" });
    if (typeof quantity !== "number" || quantity < 0) 
      return res.status(400).json({ error: "Quantity must be a non-negative number" });

    await pool.query("UPDATE medicines SET name = ?, quantity = ? WHERE id_medicine = ?", [name, quantity, req.params.id]);
    res.json({ message: "Medicine updated" });
  } catch (err) {
    handleError(res, err);
  }
});

app.delete("/medicines/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM medicines WHERE id_medicine = ?", [req.params.id]);
    res.json({ message: "Medicine deleted" });
  } catch (err) {
    handleError(res, err);
  }
});

/* -------------------- AUTHORIZED POINTS -------------------- */
app.get("/authorized_points", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM authorized_points");
    res.json(rows);
  } catch (err) {
    handleError(res, err);
  }
});

app.get("/authorized_points/:id", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM authorized_points WHERE id_authorized_point = ?", [req.params.id]);
    res.json(rows[0] || {});
  } catch (err) {
    handleError(res, err);
  }
});

app.post("/authorized_points", async (req, res) => {
  try {
    const { id_eps, name, address, city } = req.body;
    if (!id_eps || typeof id_eps !== "number" || id_eps <= 0) 
      return res.status(400).json({ error: "EPS ID must be a positive number" });
    if (!name?.trim() || !address?.trim() || !city?.trim()) 
      return res.status(400).json({ error: "Name, address and city must be non-empty strings" });

    const [eps] = await pool.query("SELECT 1 FROM eps WHERE id_eps = ?", [id_eps]);
    if (!eps.length) return res.status(400).json({ error: "EPS not found" });

    const [result] = await pool.query(
      "INSERT INTO authorized_points (id_eps, name, address, city) VALUES (?, ?, ?, ?)",
      [id_eps, name, address, city]
    );
    res.status(201).json({ id: result.insertId, id_eps, name, address, city });
  } catch (err) {
    handleError(res, err);
  }
});

app.put("/authorized_points/:id", async (req, res) => {
  try {
    const { id_eps, name, address, city } = req.body;
    if (!id_eps || typeof id_eps !== "number" || id_eps <= 0) 
      return res.status(400).json({ error: "EPS ID must be a positive number" });
    if (!name?.trim() || !address?.trim() || !city?.trim()) 
      return res.status(400).json({ error: "Name, address and city must be non-empty strings" });

    await pool.query(
      "UPDATE authorized_points SET id_eps = ?, name = ?, address = ?, city = ? WHERE id_authorized_point = ?",
      [id_eps, name, address, city, req.params.id]
    );
    res.json({ message: "Authorized point updated" });
  } catch (err) {
    handleError(res, err);
  }
});

app.delete("/authorized_points/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM authorized_points WHERE id_authorized_point = ?", [req.params.id]);
    res.json({ message: "Authorized point deleted" });
  } catch (err) {
    handleError(res, err);
  }
});

/* -------------------- SEARCH MEDICINE BY EPS -------------------- */
app.get("/search_medicine", async (req, res) => {
  try {
    const { medicine_name, eps_id } = req.query;
    if (!medicine_name || !eps_id) 
      return res.status(400).json({ error: "medicine_name and eps_id are required" });

    const query = `
      SELECT 
        ap.name AS point_name,
        ap.address,
        ms.quantity
      FROM medicine_stock ms
      JOIN medicines m ON ms.id_medicine = m.id_medicine
      JOIN authorized_points ap ON ms.id_authorized_point = ap.id_authorized_point
      WHERE m.name = ? AND ap.id_eps = ? AND ms.quantity > 0
    `;
    const [rows] = await pool.query(query, [medicine_name, eps_id]);

    if (!rows.length) 
      return res.status(404).json({ message: "No medicine found in the authorized points of this EPS" });

    res.json(rows);
  } catch (err) {
    handleError(res, err);
  }
});

/* -------------------- SERVER -------------------- */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});