/**
 * Guarda la sesión del usuario en localStorage con clave según su rol
 * @param {Object} user - Objeto del usuario con rol
 */
export function saveUserSession(user) {
  localStorage.removeItem("user");
  localStorage.removeItem("pharmacist");

  if (user.role === "pharmacist") {
    localStorage.setItem("pharmacist", JSON.stringify(user));
  } else {
    localStorage.setItem("user", JSON.stringify(user));
  }
}

/**
 * Obtiene la sesión activa desde localStorage
 * @returns {Object|null} - Usuario si existe
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
 * Limpia la sesión app/search/search.html
 */
export function clearUserSession() {
  localStorage.removeItem("user");
  localStorage.removeItem("pharmacist");
}