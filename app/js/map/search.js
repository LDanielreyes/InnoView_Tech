// ==========================
// search.js
// Lógica de búsqueda para pacientes, usando el mapa Leaflet
// ==========================

//import { protectRoute, logout } from "./router.js";

// Asegura que la ruta esté protegida
//protectRoute("PACIENTE");

// Manejador del botón de cerrar sesión
//const logoutBtn = document.getElementById("logoutBtn");
//if (logoutBtn) {
//    logoutBtn.addEventListener("click", logout);
//}

// Ocultar el campo de selección de EPS si solo hay una
const epsField = document.getElementById("epsSelect").closest(".field");
if (epsField) {
    epsField.style.display = "none";
}

// ==========================
// INICIALIZACIÓN DEL MAPA
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

// ==========================
// LÓGICA DEL FORMULARIO DE BÚSQUEDA
// ==========================
const searchForm = document.getElementById("searchForm");
const medicineInput = document.getElementById("medicine");
const pointsList = document.getElementById("pointsList");

// Define la URL del API de tu backend
const API_URL = "http://localhost:3000";

// ID fijo de la única EPS
const EPS_ID = 1;

if (searchForm) {
    searchForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Recopila los valores de entrada
        const medicineName = medicineInput.value;
        const epsId = EPS_ID;

        // Validación básica
        if (!medicineName) {
            alert("Por favor, ingresa un nombre de medicamento.");
            return;
        }

        // Limpia los marcadores y la lista de resultados anteriores
        markersGroup.clearLayers();
        pointsList.innerHTML = "";

        try {
            // Llama a tu endpoint de búsqueda en el backend
            const response = await fetch(
                `${API_URL}/search_medicine?medicine_name=${encodeURIComponent(
                    medicineName
                )}&eps_id=${epsId}`
            );
            
            // Manejo de errores de la respuesta
            if (response.status === 404) {
                pointsList.innerHTML = `<li class="no-results">No se encontraron medicamentos para **${medicineName}** en las farmacias afiliadas.</li>`;
                return;
            }
    
            if (!response.ok) {
                throw new Error("Fallo en la búsqueda de resultados.");
            }
            
            const authorizedPoints = await response.json();

            // Dibuja los marcadores y añade los elementos a la lista
            if (authorizedPoints.length === 0) {
                pointsList.innerHTML = `<li class="no-results">No se encontraron medicamentos para **${medicineName}** en las farmacias afiliadas.</li>`;
            } else {
                const bounds = L.latLngBounds([]);

                authorizedPoints.forEach((point) => {
                    // Marcador en el mapa
                    if (point.latitude && point.longitude) {
                        L.marker([point.latitude, point.longitude])
                            .addTo(markersGroup)
                            .bindPopup(
                                `<b>${point.point_name}</b><br>${point.address}<br>Stock: ${point.quantity}`
                            );
                        
                        // Añade el punto para ajustar el zoom
                        bounds.extend([point.latitude, point.longitude]);
                    }

                    // Añade a la lista de resultados
                    const li = document.createElement("li");
                    li.classList.add("points-list__item");
                    li.innerHTML = `
                        <div class="points-list__name">${point.point_name}</div>
                        <div class="points-list__address">${point.address}</div>
                        <div class="points-list__stock">
                            <span class="pill pill--success">Disponible</span>
                            <span class="pill pill--stock">Stock: ${point.quantity}</span>
                        </div>
                    `;
                    pointsList.appendChild(li);
                });

                // Ajusta el mapa para mostrar todos los marcadores
                if (bounds.isValid()) {
                    map.fitBounds(bounds, { padding: [50, 50] });
                }
            }
        } catch (err) {
            console.error("Error durante la búsqueda:", err);
            alert("Ocurrió un error al buscar. Por favor, inténtalo de nuevo.");
        }
    });
}

// ==========================
// GEOLOCALIZACIÓN DEL USUARIO
// ==========================
// Obtén el nuevo botón por su ID
const getLocationBtn = document.getElementById("getLocationBtn");
if (getLocationBtn) {
    getLocationBtn.addEventListener("click", () => {
        getUserLocation();
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
                    iconUrl: '../img/pin-de-ubicacion%201.png', 
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