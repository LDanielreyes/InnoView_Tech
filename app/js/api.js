// ================================
// api.js
// Centralizes all HTTP requests to the backend API
// ================================

// Base URL of backend API
const BASE_URL = "http://localhost:3000/api";

// -------------------------------
// Helper function for API requests
// -------------------------------
async function request(endpoint, options = {}) {
  try {
    const token = localStorage.getItem("token"); // token stored after login
    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const raw = await response.json();

    if (!response.ok) {
      throw new Error(raw.message || "API request failed");
    }

    // Normalize the response structure, since backend sends { success, message, data: { token, user } }
    const payload = raw.data || {};

    return {
      success: raw.success || false,
      message: raw.message || null,
      token: payload.token || null,
      user: payload.user || null,
      data: payload || null,
    };
  } catch (error) {
    console.error("API Error:", error.message);
    throw error;
  }
}

// ================================
// AUTH
// ================================

// Register a new user
export async function register(userData) {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

// Login an existing user
export async function login(credentials) {
  const result = await request("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });

  if (result.success && result.token) {
    localStorage.setItem("token", result.token);              // ✅ save token
    localStorage.setItem("user", JSON.stringify(result.user)); // ✅ save user
  }
  return result;
}

// ================================
// MEDICINES
// ================================

// Get all medicines (for pharmacists)
export async function getMedicines() {
  return request("/medicines");
}

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

// Update a medicine by ID
export async function updateMedicine(id, medicineData) {
  return request(`/inventory/${id}`, {
    method: "PUT",
    body: JSON.stringify(medicineData),
  });
}

// Delete a medicine by ID
export async function deleteMedicine(id) {
  return request(`/inventory/${id}`, {
    method: "DELETE",
  });
}
