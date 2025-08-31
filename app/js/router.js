// router.js
import { getUserSession, clearUserSession } from "./storage.js";

/**
 * Protect a route based on authentication and role
 * @param {string} requiredRole - Optional. Example: "PACIENTE" or "FARMACEUTICO"
 */
export function protectRoute(requiredRole) {
  const user = getUserSession();

  console.log("Current session:", user); // ✅ Debug log

  // If there's no session, force login
  if (!user || !user.role) {
    window.location.href = "../view/login.html"; // mejor llevar a login, no al home
    return;
  }

  // If a role is required and doesn't match, redirect to correct home
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
 * Clear session and redirect to login
 */
export function logout() {
  clearUserSession();
  window.location.href = "../view/login.html";
}
