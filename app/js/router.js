import { clearUserSession } from "./storage.js";

/**
 * Protege una ruta basada en la sesión y el rol requerido.
 * @param {string} requiredRole - Rol requerido ("user" o "pharmacist")
 */

/**
 * Cierra sesión y redirige al login.
 */
export function logout() {
  clearUserSession();
  window.location.href = "../../index.html";
}
