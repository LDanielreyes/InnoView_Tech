// ==========================
// api_map.js
// Functions to interact with the backend
// ==========================

const API_URL = "http://localhost:3000/api";

/**
 * Calls the backend endpoint to search for medicines.
 * @param {string} medicineName - The name of the medicine to search for.
 * @returns {Promise<Array<Object>>} List of authorized points with stock.
 */
export async function searchMedicine(medicineName) {
    const response = await fetch(
        `${API_URL}/medicines/search?name=${encodeURIComponent(medicineName)}`
    );

    if (response.status === 404) {
        return [];
    }

    if (!response.ok) {
        throw new Error("Search request failed.");
    }

    const data = await response.json();
    return data.data; // backend response structure: { success, message, data }
}
