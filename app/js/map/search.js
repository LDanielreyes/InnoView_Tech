// ==========================
// search.js
// Punto de entrada principal y orquestador de la búsqueda
// ==========================


import { initMap, addMarkersToMap, clearMarkers } from "./mapManager.js";
import { searchMedicine } from "./api_map.js";
import { updateResultsList } from "./uiManager.js";
import { logout } from "../router.js";

// Redirigir si el usuario no está autenticado como "user"
const user = JSON.parse(localStorage.getItem("user"));
if (!user) {
    window.location.href = "../../index.html";
}
; // Protege la ruta para usuarios con rol "user"



// CONSTANTES Y SELECTORES DEL DOM
const medicineInput = document.getElementById("medicine");
const searchForm = document.getElementById("searchForm");
//const epsField = document.getElementById("epsSelect").closest(".field");
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
}
const EPS_ID = 1;

// VARIABLES GLOBALES (manejadas por los módulos)
let userLocation = null;

/**
 * Inicializa la aplicación al cargar el DOM.
 */
function init() {
    initMap();
    setupEventListeners();
}

/**
 * Configura los eventos de la página.
 */
function setupEventListeners() {
    if (searchForm) {
        searchForm.addEventListener("submit", handleSearchFormSubmit);
    }
}

/**
 * Maneja el evento de envío del formulario de búsqueda.
 * @param {Event} e - El evento de envío del formulario.
 */
async function handleSearchFormSubmit(e) {
    e.preventDefault();

    const medicineName = medicineInput.value;
    if (!medicineName) {
        alert("Por favor, ingresa un nombre de medicamento.");
        return;
    }

    clearMarkers();
    updateResultsList([], medicineName); // Limpia la lista antes de la búsqueda

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                userLocation = [position.coords.latitude, position.coords.longitude];
                await performSearch(medicineName, EPS_ID);
            },
            async (error) => {
                console.error("Error al obtener la ubicación del usuario:", error);
                alert("No se pudo obtener tu ubicación. Buscando farmacias sin tu posición.");
                userLocation = null;
                await performSearch(medicineName, EPS_ID);
            }
        );
    } else {
        alert("Tu navegador no soporta la geolocalización. Buscando farmacias sin tu posición.");
        userLocation = null;
        await performSearch(medicineName, EPS_ID);
    }
}

/**
 * Orquesta la llamada a la API y la actualización de la UI.
 * @param {string} medicineName - Nombre del medicamento.
 * @param {number} epsId - ID de la EPS.
 */
async function performSearch(medicineName, epsId) {
    try {
        const authorizedPoints = await searchMedicine(medicineName, epsId);
        addMarkersToMap(authorizedPoints, userLocation);
        updateResultsList(authorizedPoints, medicineName);
    } catch (err) {
        console.error("Error durante la búsqueda:", err);
        alert("Ocurrió un error al buscar. Por favor, inténtalo de nuevo.");
    }
}

// Inicializa la aplicación cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", init);