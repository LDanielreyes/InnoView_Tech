// ==========================
// search.js (corregido)
// ==========================

import { protectRoute, logout } from "./router.js";
import { searchMedicine } from "./api.js";  // ✅ Importar API real

// 🔹 Solo PACIENTE puede acceder
protectRoute("PACIENTE");

// 🔹 Logout
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) logoutBtn.addEventListener("click", logout);

// ==========================
// MAPA
// ==========================
const map = L.map("map").setView([10.9685, -74.7813], 13);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "© OpenStreetMap contributors",
}).addTo(map);
const markersGroup = L.layerGroup().addTo(map);
const pointsList = document.getElementById("pointsList");

// ==========================
// BÚSQUEDA
// ==========================
const searchForm = document.getElementById("searchForm");
if (searchForm) {
  searchForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const medicineName = document.getElementById("medicine").value;
    const eps = document.getElementById("epsSelect").value;

    try {
      const result = await searchMedicine(medicineName, eps);

      if (!result.success || !result.data) {
        alert(result.message || "No se encontraron resultados");
        return;
      }

      const results = result.data;

      // Limpiar mapa y lista
      markersGroup.clearLayers();
      pointsList.innerHTML = "";

      // Pintar resultados
      results.forEach((p) => {
        L.marker([p.latitude, p.longitude])
          .addTo(markersGroup)
          .bindPopup(
            `<b>${p.point_name}</b><br>${p.address}<br>Cantidad: ${p.quantity}`
          );

        const li = document.createElement("li");
        li.innerHTML = `<b>${p.point_name}</b> - ${p.address} (Stock: ${p.quantity})`;
        pointsList.appendChild(li);
      });

      // Ajustar zoom a todos los puntos
      const bounds = results.map((p) => [p.latitude, p.longitude]);
      if (bounds.length > 0) map.fitBounds(bounds);

    } catch (err) {
      console.error("Search error:", err);
      alert("Error al buscar el medicamento");
    }
  });
}
