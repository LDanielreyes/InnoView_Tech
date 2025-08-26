import express from "express";
import { pool } from "./connection_db.js";

const app = express();
app.use(express.json());

/* -------------------- EPS -------------------- */
app.get("/eps", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM eps");
  res.json(rows);
});

app.get("/eps/:id", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM eps WHERE id_eps = ?", [req.params.id]);
  res.json(rows[0] || {});
});

app.post("/eps", async (req, res) => {
  const { name } = req.body;
  const [result] = await pool.query("INSERT INTO eps (name) VALUES (?)", [name]);
  res.json({ id: result.insertId, name });
});

app.put("/eps/:id", async (req, res) => {
  const { name } = req.body;
  await pool.query("UPDATE eps SET name = ? WHERE id_eps = ?", [name, req.params.id]);
  res.json({ message: "EPS updated" });
});

app.delete("/eps/:id", async (req, res) => {
  await pool.query("DELETE FROM eps WHERE id_eps = ?", [req.params.id]);
  res.json({ message: "EPS deleted" });
});

/* -------------------- MEDICINES -------------------- */
app.get("/medicines", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM medicines");
  res.json(rows);
});

app.get("/medicines/:id", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM medicines WHERE id_medicine = ?", [req.params.id]);
  res.json(rows[0] || {});
});

app.post("/medicines", async (req, res) => {
  const { name, quantity } = req.body;
  const [result] = await pool.query(
    "INSERT INTO medicines (name, quantity) VALUES (?, ?)",
    [name, quantity]
  );
  res.json({ id: result.insertId, name, quantity });
});

app.put("/medicines/:id", async (req, res) => {
  const { name, quantity } = req.body;
  await pool.query("UPDATE medicines SET name = ?, quantity = ? WHERE id_medicine = ?", [
    name,
    quantity,
    req.params.id
  ]);
  res.json({ message: "Medicine updated" });
});

app.delete("/medicines/:id", async (req, res) => {
  await pool.query("DELETE FROM medicines WHERE id_medicine = ?", [req.params.id]);
  res.json({ message: "Medicine deleted" });
});

/* -------------------- AUTHORIZED POINTS -------------------- */
app.get("/authorized_points", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM authorized_points");
  res.json(rows);
});

app.get("/authorized_points/:id", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM authorized_points WHERE id_authorized_point = ?", [
    req.params.id
  ]);
  res.json(rows[0] || {});
});

app.post("/authorized_points", async (req, res) => {
  const { id_eps, name, address, city } = req.body;
  const [result] = await pool.query(
    "INSERT INTO authorized_points (id_eps, name, address, city) VALUES (?, ?, ?, ?)",
    [id_eps, name, address, city]
  );
  res.json({ id: result.insertId, id_eps, name, address, city });
});

app.put("/authorized_points/:id", async (req, res) => {
  const { id_eps, name, address, city } = req.body;
  await pool.query(
    "UPDATE authorized_points SET id_eps = ?, name = ?, address = ?, city = ? WHERE id_authorized_point = ?",
    [id_eps, name, address, city, req.params.id]
  );
  res.json({ message: "Authorized point updated" });
});

app.delete("/authorized_points/:id", async (req, res) => {
  await pool.query("DELETE FROM authorized_points WHERE id_authorized_point = ?", [req.params.id]);
  res.json({ message: "Authorized point deleted" });
});

/* -------------------- USERS -------------------- */
app.get("/users", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM users");
  res.json(rows);
});

app.get("/users/:id", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM users WHERE id_user = ?", [req.params.id]);
  res.json(rows[0] || {});
});

app.post("/users", async (req, res) => {
  const { id_eps, name, document_type, email } = req.body;
  const [result] = await pool.query(
    "INSERT INTO users (id_eps, name, document_type, email) VALUES (?, ?, ?, ?)",
    [id_eps, name, document_type, email]
  );
  res.json({ id: result.insertId, id_eps, name, document_type, email });
});

app.put("/users/:id", async (req, res) => {
  const { id_eps, name, document_type, email } = req.body;
  await pool.query(
    "UPDATE users SET id_eps = ?, name = ?, document_type = ?, email = ? WHERE id_user = ?",
    [id_eps, name, document_type, email, req.params.id]
  );
  res.json({ message: "User updated" });
});

app.delete("/users/:id", async (req, res) => {
  await pool.query("DELETE FROM users WHERE id_user = ?", [req.params.id]);
  res.json({ message: "User deleted" });
});

/* -------------------- INVENTORIES -------------------- */
app.get("/inventories", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM inventories");
  res.json(rows);
});

app.get("/inventories/:id", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM inventories WHERE id_inventory = ?", [req.params.id]);
  res.json(rows[0] || {});
});

app.post("/inventories", async (req, res) => {
  const { id_authorized_point, id_medicine, quantity, stock } = req.body;
  const [result] = await pool.query(
    "INSERT INTO inventories (id_authorized_point, id_medicine, quantity, stock) VALUES (?, ?, ?, ?)",
    [id_authorized_point, id_medicine, quantity, stock]
  );
  res.json({ id: result.insertId, id_authorized_point, id_medicine, quantity, stock });
});

app.put("/inventories/:id", async (req, res) => {
  const { id_authorized_point, id_medicine, quantity, stock } = req.body;
  await pool.query(
    "UPDATE inventories SET id_authorized_point = ?, id_medicine = ?, quantity = ?, stock = ? WHERE id_inventory = ?",
    [id_authorized_point, id_medicine, quantity, stock, req.params.id]
  );
  res.json({ message: "Inventory updated" });
});

app.delete("/inventories/:id", async (req, res) => {
  await pool.query("DELETE FROM inventories WHERE id_inventory = ?", [req.params.id]);
  res.json({ message: "Inventory deleted" });
});

/* -------------------- PHARMACISTS -------------------- */
app.get("/pharmacists", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM pharmacists");
  res.json(rows);
});

app.get("/pharmacists/:id", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM pharmacists WHERE id_pharmacist = ?", [req.params.id]);
  res.json(rows[0] || {});
});

app.post("/pharmacists", async (req, res) => {
  const { id_branch, name, email } = req.body;
  const [result] = await pool.query(
    "INSERT INTO pharmacists (id_branch, name, email) VALUES (?, ?, ?)",
    [id_branch, name, email]
  );
  res.json({ id: result.insertId, id_branch, name, email });
});

app.put("/pharmacists/:id", async (req, res) => {
  const { id_branch, name, email } = req.body;
  await pool.query(
    "UPDATE pharmacists SET id_branch = ?, name = ?, email = ? WHERE id_pharmacist = ?",
    [id_branch, name, email, req.params.id]
  );
  res.json({ message: "Pharmacist updated" });
});

app.delete("/pharmacists/:id", async (req, res) => {
  await pool.query("DELETE FROM pharmacists WHERE id_pharmacist = ?", [req.params.id]);
  res.json({ message: "Pharmacist deleted" });
});

/* -------------------- SERVER -------------------- */
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});