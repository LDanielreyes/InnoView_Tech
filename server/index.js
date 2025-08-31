import express from "express";
import { pool } from "./connection_db.js";
import cors from "cors";
import bcrypt from "bcrypt";
import session from "express-session";

const app = express();
app.use(express.json());

// Configuración de CORS con credenciales
// Permite que el cliente de Vite (localhost:5173) se comunique con el servidor
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

// Configuración de sesiones
app.use(session({
    secret: "123456789", 
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Cambia a 'true' en producción con HTTPS
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 // 24 horas
    },
}));

/* -------------------- ERROR HANDLER -------------------- */
const handleError = (res, err, message = "Server error") => {
    console.error(err);
    res.status(500).json({ success: false, message });
};

/* -------------------- AUTH -------------------- */
app.post("/auth/register", async (req, res) => {
    try {
        const { full_name, document_type, document_number, email, phone, password, id_eps } = req.body;

        if (!full_name || !document_type || !document_number || !email || !phone || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const saltRounds = 10;
        const password_hash = await bcrypt.hash(password, saltRounds);

        const [existing] = await pool.query("SELECT 1 FROM users WHERE email = ? OR document_number = ?", [email, document_number]);
        if (existing.length) {
            return res.status(400).json({ success: false, message: "User with this email or document number already exists" });
        }

        const [result] = await pool.query(
            "INSERT INTO users (id_eps, full_name, document_type, document_number, email, phone, password_hash, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())",
            [id_eps, full_name, document_type, document_number, email, phone, password_hash]
        );
        res.status(201).json({ success: true, message: "User registered successfully", id_user: result.insertId });
    } catch (err) {
        handleError(res, err, "Error during registration");
    }
});

app.post("/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
        const user = rows[0];

        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        req.session.user = {
            id: user.id_user,
            email: user.email,
            role: user.role
        };

        res.status(200).json({
            success: true,
            message: "Login successful",
            user: { id: user.id_user, email: user.email, role: user.role }
        });
    } catch (err) {
        handleError(res, err, "Error during login");
    }
});

/* -------------------- Resto de las rutas de la API -------------------- */
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
            ap.point_name AS point_name,
            ap.address,
            ap.latitude,
            ap.longitude,
            i.quantity
        FROM inventories i
        JOIN medicines m ON i.id_medicine = m.id_medicine
        JOIN authorized_points ap ON i.id_authorized_point = ap.id_authorized_point
        WHERE m.name = 'Paracetamol' AND ap.id_eps = '1' AND i.quantity > 0
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