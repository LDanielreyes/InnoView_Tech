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

    // Collect form data (mapped to "users" table)
    const data = {
      name: document.getElementById("name").value,
      document_type: document.getElementById("document_type").value,
      document_number: document.getElementById("document_number").value,
      phone: document.getElementById("phone").value,
      eps: document.getElementById("eps").value,
      email: document.getElementById("email").value,
      password: document.getElementById("password").value, // will be hashed in backend
    };

    try {
      const result = await register(data);

      // If backend confirms success → redirect to login
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

    // Collect login credentials
    const data = {
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
    };

    try {
      const result = await login(data);

      if (result.success) {
        // Save session in localStorage
        saveUserSession(result.user);

        // Redirect based on role
        if (result.user.role === "PACIENTE") {
          window.location.href = "../search/search.html";
        } else if (result.user.role === "FARMACEUTICO") {
          window.location.href = "../inventory/inventory.html";
        } else {
          window.location.href = "../../index.html"; // fallback
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
