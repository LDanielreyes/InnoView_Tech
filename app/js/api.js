// ================================
// api.js
// Centralizes all HTTP requests to the backend API
// ================================

// Base URL of backend API
const BASE_URL = "http://localhost:3000";

// -------------------------------
// Helper function for API requests
// -------------------------------
async function request(endpoint, options = {}) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });

    const data = await response.json();

    // Throw error if response failed
    if (!response.ok) {
      throw new Error(data.message || "API request failed");
    }

    // Always return the same structure
    return {
      success: data.success || false,
      message: data.message || null,
      user: data.user || null,
      data: data.data || null,
    };
  } catch (error) {
    console.error("API Error:", error.message);
    throw error;
  }
}

// ================================
// AUTH
// ================================

// Register new user
export async function register(userData) {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

// Login existing user
export async function login(credentials) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

// ================================
// MEDICINES
// ================================

// Search medicines (for patients)
export async function searchMedicine(name) {
  return request(`/medicines/search?name=${encodeURIComponent(name)}`);
}

// ================================
// INVENTORY
// ================================

// Get all medicines in pharmacy (for pharmacists)
export async function getInventory() {
  return request("/inventory");
}

// Add a new medicine
export async function addMedicine(medicineData) {
  return request("/inventory", {
    method: "POST",
    body: JSON.stringify(medicineData),
  });
}

// Update medicine by ID
export async function updateMedicine(id, medicineData) {
  return request(`/inventory/${id}`, {
    method: "PUT",
    body: JSON.stringify(medicineData),
  });
}

// Delete medicine by ID
export async function deleteMedicine(id) {
  return request(`/inventory/${id}`, {
    method: "DELETE",
  });
}
