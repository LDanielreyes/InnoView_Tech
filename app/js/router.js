// ================================
// router.js
// Controla protección de rutas y logout
// ================================

import { getUserSession, clearUserSession } from "./storage.js";

/**
 * Protect a route based on authentication and role
 * @param {string} requiredRole - Optional. Ejemplo: "PACIENTE" o "FARMACEUTICO"
 */
export function protectRoute(requiredRole) {
  const user = getUserSession();

  console.log("Current session:", user); // ✅ Debug log

  // Si no hay sesión → forzar login
  if (!user || !user.role) {
    window.location.href = "../view/login.html"; 
    return;
  }

  // Si el rol no coincide → redirigir a su home correcto
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
 * Cierra sesión y redirige a login
 */
export function logout() {
  clearUserSession();
  localStorage.removeItem("token"); // ✅ limpia token
  localStorage.removeItem("user");  // ✅ limpia user
  window.location.href = "../view/login.html";
}
