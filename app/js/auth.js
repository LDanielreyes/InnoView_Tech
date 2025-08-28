// ---- REGISTER ----
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Capture values from form
    const city = document.getElementById("city").value;
    const document_type = document.getElementById("document_type").value;
    const document_number = document.getElementById("document_number").value;
    const eps = document.getElementById("eps").value;
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const data = { city, document_type, document_number, eps, name, email, password };

    try {
      // Send to backend
      const res = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      alert(result.message);

      // Redirect to login page if success
      if (res.ok) {
        window.location.href = "../view/login.html";
      }
    } catch (err) {
      console.error("Register error:", err);
      alert("Error registering user.");
    }
  });
}

// ---- LOGIN ----
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
    };

    try {
      // Send data to backend
      const res = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.message || "Invalid credentials");
        return;
      }

      alert("Login successful!");

      // Redirect by role (example)
      if (result.role === "PACIENTE") {
        window.location.href = "../view/search.html";
      } else if (result.role === "FARMACEUTICO") {
        window.location.href = "../view/inventory.html";
      } else {
        window.location.href = "../view/home.html"; // fallback
      }

    } catch (err) {
      console.error("Login error:", err);
      alert("Error logging in.");
    }
  });
}
