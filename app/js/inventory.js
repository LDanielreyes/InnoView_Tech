// ==========================
// inventory.js
// Pharmacist inventory management
// ==========================

import { protectRoute, logout } from "./router.js";
import { getUserSession } from "./storage.js";

// Protect this route → only FARMACEUTICO can access
//protectRoute("FARMACEUTICO");

// Logout button
const logoutBtns = document.querySelectorAll(".logout");
logoutBtns.forEach((btn) => btn.addEventListener("click", logout));

// Medicine form (add/edit)
const medicineForm = document.getElementById("medicineForm");
const inventoryList = document.getElementById("inventoryList");

if (medicineForm) {
  medicineForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const id = document.getElementById("medicineId").value;
    const name = document.getElementById("name").value;
    const quantity = document.getElementById("quantity").value;
    const description = document.getElementById("description").value;

    // For now → just simulate adding/editing
    const newRow = document.createElement("div");
    newRow.classList.add("row");
    newRow.innerHTML = `
      <div class="cell">${name}</div>
      <div class="cell">${quantity}</div>
      <div class="cell">${description}</div>
      <div class="cell">${new Date().toLocaleDateString()}</div>
      <div class="cell right">
        <button class="icon edit">✏️</button>
        <button class="icon delete">🗑️</button>
      </div>
    `;

    inventoryList.appendChild(newRow);
    medicineForm.reset();
  });
}

// TODO: Add edit/delete logic
