const express = require("express");
const app = express();
const PORT = 3000;

// Middleware para manejar JSON
app.use(express.json());

// Simulación de inventario por puntos autorizados
const inventory = {
  "point-001": [
    { id: 1, item: "Laptop", qty: 10 },
    { id: 2, item: "Mouse", qty: 25 }
  ],
  "point-002": [
    { id: 3, item: "Keyboard", qty: 15 },
    { id: 4, item: "Monitor", qty: 7 }
  ]
};

// ✅ Ruta para ver inventario por punto autorizado
app.get("/inventory/:pointId", (req, res) => {
  const { pointId } = req.params;

  if (inventory[pointId]) {
    res.json({
      authorizedPoint: pointId,
      products: inventory[pointId]
    });
  } else {
    res.status(403).json({
      error: "❌ Punto no autorizado o sin inventario"
    });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
