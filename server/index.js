import express from "express";
import { pool } from "./connection_db.js";

const app = express();
app.use(express.json());

/* -------------------- MEDICINES -------------------- */
app.get("/medicines", async (req, res) => {
  const [medicines] = await pool.query("SELECT * FROM medicines");
  res.json(medicines);
});

app.get("/medicines/:id", async (req, res) => {
  const [medicines] = await pool.query("SELECT * FROM medicines WHERE id_medicine = ?", [req.params.id]);
  res.json(medicines[0] || {});
});

app.post("/medicines", async (req, res) => {
  const { name, quantity } = req.body;
  const [result] = await pool.query(
    "INSERT INTO medicines (name, quantity) VALUES (?, ?)",
    [name, quantity]
  );
  res.json({ id_medicine: result.insertId, name, quantity });
});

app.put("/medicines/:id", async (req, res) => {
  const { name, quantity } = req.body;
  await pool.query(
    "UPDATE medicines SET name = ?, quantity = ? WHERE id_medicine = ?",
    [name, quantity, req.params.id]
  );
  res.json({ message: "Medicine updated" });
});

app.delete("/medicines/:id", async (req, res) => {
  await pool.query("DELETE FROM medicines WHERE id_medicine = ?", [req.params.id]);
  res.json({ message: "Medicine deleted" });
});

/* -------------------- AUTHORIZED POINTS -------------------- */
app.get("/authorized_points", async (req, res) => {
  const [authorizedPoints] = await pool.query("SELECT * FROM authorized_points");
  res.json(authorizedPoints);
});

app.get("/authorized_points/:id", async (req, res) => {
  const [authorizedPoints] = await pool.query("SELECT * FROM authorized_points WHERE id_authorized_point = ?", [
    req.params.id
  ]);
  res.json(authorizedPoints[0] || {});
});

app.post("/authorized_points", async (req, res) => {
  const { id_eps, point_name, address, city } = req.body;
  const [result] = await pool.query(
    "INSERT INTO authorized_points (id_eps, point_name, address, city) VALUES (?, ?, ?, ?)",
    [id_eps, point_name, address, city]
  );
  res.json({ id_authorized_point: result.insertId, id_eps, point_name, address, city });
});

app.put("/authorized_points/:id", async (req, res) => {
  const { id_eps, point_name, address, city } = req.body;
  await pool.query(
    "UPDATE authorized_points SET id_eps = ?, point_name = ?, address = ?, city = ? WHERE id_authorized_point = ?",
    [id_eps, point_name, address, city, req.params.id]
  );
  res.json({ message: "Authorized point updated" });
});

app.delete("/authorized_points/:id", async (req, res) => {
  await pool.query("DELETE FROM authorized_points WHERE id_authorized_point = ?", [req.params.id]);
  res.json({ message: "Authorized point deleted" });
});

/* -------------------- USERS -------------------- */
app.get("/users", async (req, res) => {
  const [users] = await pool.query("SELECT * FROM users");
  res.json(users);
});

app.get("/users/:id", async (req, res) => {
  const [users] = await pool.query("SELECT * FROM users WHERE id_user = ?", [req.params.id]);
  res.json(users[0] || {});
});

app.post("/users", async (req, res) => {
  const { id_eps, full_name, document_type, document_number, email, phone, password_hash } = req.body;
  const [result] = await pool.query(
    "INSERT INTO users (id_eps, full_name, document_type, document_number, email, phone, password_hash) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [id_eps, full_name, document_type, document_number, email, phone, password_hash]
  );
  res.json({ id_user: result.insertId, id_eps, full_name, document_type, document_number, email, phone });
});

app.put("/users/:id", async (req, res) => {
  const { id_eps, full_name, document_type, document_number, email, phone, password_hash } = req.body;
  await pool.query(
    "UPDATE users SET id_eps = ?, full_name = ?, document_type = ?, document_number = ?, email = ?, phone = ?, password_hash = ? WHERE id_user = ?",
    [id_eps, full_name, document_type, document_number, email, phone, password_hash, req.params.id]
  );
  res.json({ message: "User updated" });
});

app.delete("/users/:id", async (req, res) => {
  await pool.query("DELETE FROM users WHERE id_user = ?", [req.params.id]);
  res.json({ message: "User deleted" });
});

/* -------------------- INVENTORIES -------------------- */
app.get("/inventories", async (req, res) => {
  const [inventories] = await pool.query("SELECT * FROM inventories");
  res.json(inventories);
});

app.get("/inventories/:id", async (req, res) => {
  const [inventories] = await pool.query("SELECT * FROM inventories WHERE id_inventory = ?", [req.params.id]);
  res.json(inventories[0] || {});
});

app.post("/inventories", async (req, res) => {
  const { id_authorized_point, id_medicine, quantity } = req.body;
  const [result] = await pool.query(
    "INSERT INTO inventories (id_authorized_point, id_medicine, quantity) VALUES (?, ?, ?)",
    [id_authorized_point, id_medicine, quantity]
  );
  res.json({ id_inventory: result.insertId, id_authorized_point, id_medicine, quantity });
});

app.put("/inventories/:id", async (req, res) => {
  const { id_authorized_point, id_medicine, quantity } = req.body;
  await pool.query(
    "UPDATE inventories SET id_authorized_point = ?, id_medicine = ?, quantity = ? WHERE id_inventory = ?",
    [id_authorized_point, id_medicine, quantity, req.params.id]
  );
  res.json({ message: "Inventory updated" });
});

app.delete("/inventories/:id", async (req, res) => {
  await pool.query("DELETE FROM inventories WHERE id_inventory = ?", [req.params.id]);
  res.json({ message: "Inventory deleted" });
});

/* -------------------- PHARMACISTS -------------------- */
app.get("/pharmacists", async (req, res) => {
  const [pharmacists] = await pool.query("SELECT * FROM pharmacists");
  res.json(pharmacists);
});

app.get("/pharmacists/:id", async (req, res) => {
  const [pharmacists] = await pool.query("SELECT * FROM pharmacists WHERE id_pharmacist = ?", [req.params.id]);
  res.json(pharmacists[0] || {});
});

app.post("/pharmacists", async (req, res) => {
  const { id_authorized_point, name, email } = req.body;
  const [result] = await pool.query(
    "INSERT INTO pharmacists (id_authorized_point, name, email) VALUES (?, ?, ?)",
    [id_authorized_point, name, email]
  );
  res.json({ id_pharmacist: result.insertId, id_authorized_point, name, email });
});

app.put("/pharmacists/:id", async (req, res) => {
  const { id_authorized_point, name, email } = req.body;
  await pool.query(
    "UPDATE pharmacists SET id_authorized_point = ?, name = ?, email = ? WHERE id_pharmacist = ?",
    [id_authorized_point, name, email, req.params.id]
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