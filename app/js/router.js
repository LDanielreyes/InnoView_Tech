// router.js
import { getUserSession, clearUserSession } from "./storage.js";

/**
 * Protect a route based on authentication and role
 * @param {string} requiredRole - Optional. Example: "PACIENTE" or "FARMACEUTICO"
 */
export function protectRoute(requiredRole) {
  const user = getUserSession();

  // If there's no session, force login
  //if (!user) {
  //  window.location.href = "../../index.html"; 
  ////}

  // If a role is required and doesn't match, send to home
  //if (requiredRole && user.role !== requiredRole) {
  //  window.location.href = "../../index.html"; 
  //}
//}

/**
 * Clear session and redirect to login
 */
//export function logout() {
//  clearUserSession();
//  window.location.href = "../login/login.html";
}
