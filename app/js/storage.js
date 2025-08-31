// router.js
import { getUserSession, clearUserSession } from "./storage.js";

/**
 * Protect a route based on authentication and role
 * @param {string} requiredRole - Role required for the page ("PACIENTE" or "FARMACEUTICO")
 */
export function protectRoute(requiredRole) {
  const user = getUserSession();
  console.log("🔑 Current session:", user);

  // If no session → redirect to login
  if (!user || !user.role) {
    console.warn("⚠️ No active session, redirecting to login...");
    window.location.href = "../login/login.html";
    return;
  }

  // If this page requires a role and it doesn't match
  if (requiredRole && user.role !== requiredRole) {
    console.warn(`⚠️ Role mismatch: required=${requiredRole}, user=${user.role}`);

    // Redirect user to their correct home based on role
    if (user.role === "PACIENTE") {
      window.location.href = "../search/search.html";
    } else if (user.role === "FARMACEUTICO") {
      window.location.href = "../inventory/inventory.html";
    } else {
      window.location.href = "../../index.html"; // fallback
    }
  }
}

/**
 * Clear session and redirect to login
 */
export function logout() {
  clearUserSession();
  console.log("🚪 Session cleared, redirecting to login...");
  window.location.href = "../login/login.html";
}
