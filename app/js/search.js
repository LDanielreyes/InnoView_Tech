// ==========================
// search.js
// Patient search logic with Leaflet map
// ==========================

import { protectRoute, logout } from "./router.js";

// 🔹 Protect this route → only PACIENTE role can access
protectRoute("PACIENTE");

// 🔹 Logout button handler
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", logout);
}

// ==========================
// MAP INITIALIZATION
// ==========================

// Create map centered in Barranquilla (example coordinates)
const map = L.map("map").setView([10.9685, -74.7813], 13);

// Add OpenStreetMap tiles
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "© OpenStreetMap contributors",
}).addTo(map);

// Create a group layer for dynamic markers
const markersGroup = L.layerGroup().addTo(map);

// Reference to results list
const pointsList = document.getElementById("pointsList");

// ==========================
// SEARCH FORM LOGIC
// ==========================
const searchForm = document.getElementById("searchForm");

if (searchForm) {
  searchForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Collect input values
    const medicineName = document.getElementById("medicine").value;
    const eps = document.getElementById("epsSelect").value;

    try {
      // 🔹 Simulated backend request (replace later with API call)
      // Example: fetch(`${BASE_URL}/medicines/search?name=${medicineName}&eps=${eps}`)
      const results = [
        {
          name: "Farmacia Principal",
          address: "Cra 45 # 56-23",
          quantity: 20,
          latitude: 10.9685,
          longitude: -74.7813,
        },
        {
          name: "Droguería Central",
          address: "Calle 72 # 48-15",
          quantity: 15,
          latitude: 10.975,
          longitude: -74.79,
        },
      ];
      

      // Clear previous markers and list
      markersGroup.clearLayers();
      pointsList.innerHTML = "";

      // Draw markers + add list items
      results.forEach((p) => {
        // Marker on map
        L.marker([p.latitude, p.longitude])
          .addTo(markersGroup)
          .bindPopup(`<b>${p.name}</b><br>${p.address}<br>Cantidad: ${p.quantity}`);

        // Add to results list
        const li = document.createElement("li");
        li.innerHTML = `<b>${p.name}</b> - ${p.address} (Stock: ${p.quantity})`;
        pointsList.appendChild(li);
      });

      // Zoom to fit all markers
      const bounds = results.map((p) => [p.latitude, p.longitude]);
      map.fitBounds(bounds);

    } catch (err) {
      console.error("Search error:", err);
      alert("Error while searching medicine");
    }
  });
}
/**
 * Intenta obtener la ubicación actual del usuario y agrega un marcador al mapa.
 */
function getUserLocation() {
    // Comprueba si el navegador soporta la geolocalización
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                const userLocation = [lat, lon];
                const accuracy = position.coords.accuracy;

                // Crea un icono personalizado para el marcador del usuario
                const userIcon = L.icon({
                    iconUrl: '../img/pin-de-ubicacion%201.png', // Usa el mismo icono de ubicación
                    iconSize: [38, 38],
                    iconAnchor: [19, 38],
                    popupAnchor: [0, -30]
                });

                // Agrega un marcador para la ubicación del usuario
                L.marker(userLocation, { icon: userIcon }).addTo(map)
                    .bindPopup("¡Estás aquí!").openPopup();

                // Centra el mapa en la ubicación del usuario
                map.setView(userLocation, 15);

                console.log(`Ubicación del usuario: Latitud ${lat}, Longitud ${lon}`);
            },
            (error) => {
                // Maneja errores si el usuario deniega el permiso o si hay un problema
                console.error("Error al obtener la ubicación del usuario:", error);
                alert("No se pudo obtener tu ubicación. Por favor, asegúrate de haber dado permiso para la geolocalización en tu navegador.");
            }
        );
    } else {
        alert("Tu navegador no soporta la geolocalización.");
    }
}