// ================================
// storage.js
// Handles user session in localStorage
// ================================

/**
 * Save user session in localStorage
 * Stores separately depending on user role
 * @param {Object} user - User object containing role and session data
 */
export function saveUserSession(user) {
  // Clear any previous data before saving new session
  localStorage.removeItem("user");
  localStorage.removeItem("pharmacist");

  if (user.role === "FARMACEUTICO") {
    localStorage.setItem("pharmacist", JSON.stringify(user));
  } else if (user.role === "PACIENTE") {
    localStorage.setItem("user", JSON.stringify(user));
  } else {
    // Default case → stored as "user"
    localStorage.setItem("user", JSON.stringify(user));
  }
}

/**
 * Retrieve user session from localStorage
 * Priority: pharmacist → patient → null
 * @returns {Object|null} Parsed user object or null if no session
 */
export function getUserSession() {
  const pharmacist = localStorage.getItem("pharmacist");
  const user = localStorage.getItem("user");

  return pharmacist
    ? JSON.parse(pharmacist)
    : user
    ? JSON.parse(user)
    : null;
}

/**
 * Clear all user-related session data
 */
export function clearUserSession() {
  localStorage.removeItem("user");
  localStorage.removeItem("pharmacist");
  localStorage.removeItem("token");
}
