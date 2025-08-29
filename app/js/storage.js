// storage.js

/**
 * Save user session data in localStorage
 * @param {Object} user - The user object returned from backend (id, name, role, token, etc.)
 */
export function saveUserSession(user) {
  localStorage.setItem("user", JSON.stringify(user));
}

/**
 * Retrieve user session data from localStorage
 * @returns {Object|null} - The user object if exists, otherwise null
 */
export function getUserSession() {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

/**
 * Clear user session data from localStorage
 */
export function clearUserSession() {
  localStorage.removeItem("user");
}
