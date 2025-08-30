import { protectRoute } from "../../app/js/router.js";
const API_URL = "http://localhost:3000/auth";

//protectRoute();

/* -------------------- REGISTER -------------------- */
async function registerUser(userData) {
  try {
    const res = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Registration error");

    alert("Registration successful. You can now log in.");
    window.location.href = "login.html";
  } catch (err) {
    alert(err.message);
  }
}

/* -------------------- LOGIN -------------------- */
async function loginUser(credentials) {
  try {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Login error");

    localStorage.setItem("token", result.token);
    localStorage.setItem("user", JSON.stringify(result.user));

    alert("Welcome " + result.user.full_name);
    window.location.href = "inventory.html";
  } catch (err) {
    alert(err.message);
  }
}

/* -------------------- FORM HANDLERS -------------------- */
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const userData = {
      full_name: document.getElementById("name").value.trim(),
      document_type: document.getElementById("document_type").value,
      document_number: document.getElementById("document_number").value.trim(),
      phone: document.getElementById("phone").value.trim(),
      eps_name: document.getElementById("eps").value.trim(), // ✅ sent as eps_name
      email: document.getElementById("email").value.trim(),
      password: document.getElementById("password").value,
    };
    registerUser(userData);
  });
}

const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const credentials = {
      email: document.getElementById("email").value.trim(),
      password: document.getElementById("password").value,
    };
    loginUser(credentials);
  });
}
