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

    // Collect registration data from form inputs
    const data = {
      name: document.getElementById("name").value.trim(),
      document_type: document.getElementById("document_type").value,
      document_number: document.getElementById("document_number").value,
      phone: document.getElementById("phone").value,
      eps: document.getElementById("eps").value,
      email: document.getElementById("email").value.trim(),
      password: document.getElementById("password").value,
    };

    try {
      // Call API to register new user
      const result = await register(data);

      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "User successfully registered",
          text: "You can now log in.",
          confirmButtonColor: "#4f46e5"
        }).then(() => {
          window.location.href = "../view/login.html"; // Redirect to login page
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Registration error",
          text: result.message || "Error during registration",
          confirmButtonColor: "#dc2626"
        });
      }
    } catch (err) {
      console.error("Register error:", err);
      Swal.fire({
        icon: "error",
        title: "Server error",
        text: "Server error during registration",
        confirmButtonColor: "#dc2626"
      });
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
      email: document.getElementById("email").value.trim(),
      password: document.getElementById("password").value,
    };

    try {
      // Call API to log in
      const result = await login(data);

      if (result.success && result.user) {
        // Build session object with user info
        const userSession = {
          id: result.user.id,
          full_name: result.user.full_name, // always use full_name
          email: result.user.email,
          role: result.user.role,
          token: result.token,
          id_authorized_point: result.user.id_authorized_point || null,
        };

        // Save user session
        saveUserSession(userSession);
        localStorage.setItem("token", result.token);

        // Success message before redirect
        Swal.fire({
          icon: "success",
          title: "Login successful",
          text: `Welcome ${userSession.full_name}`,
          confirmButtonColor: "#4f46e5"
        }).then(() => {
          // Redirect user depending on their role
          if (userSession.role === "PACIENTE") {
            window.location.href = "../view/search.html";
          } else if (userSession.role === "FARMACEUTICO") {
            window.location.href = "../view/inventory.html";
          } else {
            window.location.href = "../../index.html";
          }
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Invalid credentials",
          text: result.message || "Please check your email and password",
          confirmButtonColor: "#dc2626"
        });
      }
    } catch (err) {
      console.error("Login error:", err);
      Swal.fire({
        icon: "error",
        title: "Server error",
        text: "Server error during login",
        confirmButtonColor: "#dc2626"
      });
    }
  });
}
