// ==========================
// api_map.js
// Funciones para interactuar con el backend
// ==========================

const API_URL = "http://localhost:3000";

/**
 * Llama al endpoint de búsqueda de medicamentos del backend.
 * @param {string} medicineName - El nombre del medicamento a buscar.
 * @param {number} epsId - El ID de la EPS.
 * @returns {Promise<Array<Object>>} Una promesa que resuelve con la lista de puntos autorizados.
 */
export async function searchMedicine(medicineName, epsId) {
    const response = await fetch(
        `${API_URL}/search_medicine?medicine_name=${encodeURIComponent(medicineName)}&eps_id=${epsId}`
    );

    if (response.status === 404) {
        return [];
    }

    if (!response.ok) {
        throw new Error("Fallo en la búsqueda de resultados.");
    }

    return response.json();
}