// ==========================
// search.js
// Lógica de búsqueda para pacientes, usando el mapa Leaflet
// ==========================

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

// Create a single group layer for all dynamic markers (user and pharmacies)
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

        const medicineName = medicineInput.value;
        const epsId = EPS_ID;

        // Validación básica
        if (!medicineName) {
            alert("Por favor, ingresa un nombre de medicamento.");
            return;
        }

        // Limpia todos los marcadores del mapa y la lista antes de una nueva búsqueda
        markersGroup.clearLayers();
        pointsList.innerHTML = "";

        // Intenta obtener la ubicación del usuario
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const userLocation = [position.coords.latitude, position.coords.longitude];

                    // Crea un icono personalizado para el marcador del usuario
                    const userIcon = L.icon({
                        iconUrl: '../img/pin-de-ubicacion%201.png',
                        iconSize: [38, 38],
                        iconAnchor: [19, 38],
                        popupAnchor: [0, -30]
                    });

                    // Agrega un marcador para la ubicación del usuario al grupo de marcadores
                    L.marker(userLocation, { icon: userIcon }).addTo(markersGroup).bindPopup("¡Estás aquí!").openPopup();

                    // Ahora, realiza la búsqueda de farmacias y actualiza el mapa
                    await performSearch(medicineName, epsId, userLocation);
                },
                async (error) => {
                    console.error("Error al obtener la ubicación del usuario:", error);
                    alert("No se pudo obtener tu ubicación. Buscando farmacias sin tu posición.");
                    // Continúa con la búsqueda incluso sin la ubicación del usuario
                    await performSearch(medicineName, epsId, null);
                }
            );
        } else {
            alert("Tu navegador no soporta la geolocalización. Buscando farmacias sin tu posición.");
            // Continúa con la búsqueda sin la ubicación del usuario
            await performSearch(medicineName, epsId, null);
        }
    });
}

/**
 * Realiza la búsqueda real de farmacias y actualiza el mapa y la lista.
 * @param {string} medicineName - El nombre del medicamento a buscar.
 * @param {number} epsId - El ID de la EPS.
 * @param {Array<number> | null} userLocation - Las coordenadas del usuario, o null si no están disponibles.
 */
async function performSearch(medicineName, epsId, userLocation) {
    try {
        const response = await fetch(
            `${API_URL}/search_medicine?medicine_name=${encodeURIComponent(medicineName)}&eps_id=${epsId}`
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
        const bounds = L.latLngBounds([]);

        // Si se tiene la ubicación del usuario, se incluye en los límites del mapa
        if (userLocation) {
            bounds.extend(userLocation);
        }

        // Dibuja los marcadores de farmacias y añade los elementos a la lista
        if (authorizedPoints.length === 0) {
            pointsList.innerHTML = `<li class="no-results">No se encontraron medicamentos para **${medicineName}** en las farmacias afiliadas.</li>`;
        } else {
            authorizedPoints.forEach((point) => {
                // Marcador en el mapa
                if (point.latitude && point.longitude) {
                    const marker = L.marker([point.latitude, point.longitude])
                        .addTo(markersGroup)
                        .bindPopup(`<b>${point.point_name}</b><br>${point.address}<br>Stock: ${point.quantity}`);

                    // Añade el punto a los límites para ajustar el zoom
                    bounds.extend(marker.getLatLng());
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
        }

        // Ajusta el mapa para mostrar todos los marcadores (usuario y farmacias)
        if (bounds.isValid()) {
            map.fitBounds(bounds, { padding: [50, 50] });
        }

    } catch (err) {
        console.error("Error durante la búsqueda:", err);
        alert("Ocurrió un error al buscar. Por favor, inténtalo de nuevo.");
    }
}