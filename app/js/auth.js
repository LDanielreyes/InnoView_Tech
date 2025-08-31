// ==========================
// auth.js
// Handles user authentication (register and login)
// ==========================

import { register, login } from "./api.js";
import { saveUserSession } from "./storage.js";

// ==========================
// REGISTER LOGIC
// ==========================
const registerForm = document.getElementById("registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Collect form data
    const data = {
      name: document.getElementById("name").value,
      document_type: document.getElementById("document_type").value,
      document_number: document.getElementById("document_number").value,
      phone: document.getElementById("phone").value,
      eps: document.getElementById("eps").value,
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
    };

    try {
      const result = await register(data);

      if (result.success) {
        alert("User registered successfully! Please log in.");
        window.location.href = "../login/login.html";
      } else {
        alert(result.message || "Error during registration");
      }
    } catch (err) {
      console.error("Register error:", err);
      alert("Server error during registration");
    }
  });
}

// ==========================
// LOGIN LOGIC
// ==========================
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
    };

    try {
      const result = await login(data);

      if (result.success && result.user) {
        // Build a normalized user session object
        const userSession = {
          id: result.user.id,
          full_name: result.user.full_name,
          email: result.user.email,
          role: result.user.role,
          token: result.user.token || null,
          id_authorized_point: result.user.id_authorized_point || null,
        };

        // Save session in localStorage
        saveUserSession(userSession);

        // Debug log
        console.log("✅ Saved user session:", userSession);

        // Redirect based on role
        if (userSession.role === "PACIENTE") {
          console.log("➡ Redirecting PACIENTE to search.html");
          window.location.href = "../view/search.html";
        } else if (userSession.role === "FARMACEUTICO") {
          console.log("➡ Redirecting FARMACEUTICO to inventory.html");
          window.location.href = "../view/inventory.html";
        } else {
          console.log("➡ Redirecting fallback to home");
          window.location.href = "../../index.html";
        }
      } else {
        alert(result.message || "Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Server error during login");
    }
  });
}
