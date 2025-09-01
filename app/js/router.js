// ================================
// router.js
// Handles route protection and logout
// ================================

import { getUserSession, clearUserSession } from "./storage.js";

/**
 * Protects a route based on authentication and role
 * @param {string} requiredRole - Example: "PACIENTE" or "FARMACEUTICO"
 */
export function protectRoute(requiredRole) {
  const user = getUserSession();

  console.log("🔎 Current session:", user);

  // If no session or role → redirect to login
  if (!user || !user.role) {
    window.location.href = "../view/login.html";
    return;
  }

  // If the role does not match → redirect to the correct home
  if (requiredRole && user.role !== requiredRole) {
    if (user.role === "PACIENTE") {
      window.location.href = "../view/search.html";
    } else if (user.role === "FARMACEUTICO") {
      window.location.href = "../view/inventory.html";
    } else {
      window.location.href = "../../index.html";
    }
  }
}

/**
 * Logs out user and redirects to login
 */
export function logout() {
  clearUserSession();
  window.location.href = "../view/login.html";
}
