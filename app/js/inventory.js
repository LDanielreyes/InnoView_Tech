// ==========================
// inventory.js
// Manages pharmacist session and inventory operations
// ==========================

import { logout } from "./router.js";
import { getInventory, addMedicine, updateMedicine, deleteMedicine, searchInventory } from "./api.js";
import { getUserSession } from "./storage.js";

// ---------------- Display pharmacist's name ----------------
const pharmacistName = document.getElementById("pharmacistName");
const user = getUserSession();

if (user && user.role === "FARMACEUTICO") {
  pharmacistName.textContent = user.full_name || "Pharmacist"; // always use full_name
} else {
  pharmacistName.textContent = "Guest";
}

// ---------------- Logout ----------------
document.querySelectorAll(".logout").forEach((btn) =>
  btn.addEventListener("click", logout)
);

// ---------------- DOM Elements ----------------
const medicineForm = document.getElementById("medicineForm");
const inventoryList = document.getElementById("inventoryList");
const hiddenId = document.getElementById("medicineId");
const inputMedicine = document.getElementById("medicineName");
const inputQuantity = document.getElementById("quantity");
const searchInput = document.getElementById("searchInput");

// ---------------- Render inventory rows ----------------
function renderInventory(data) {
  inventoryList.innerHTML = "";

  data.forEach((item) => {
    const row = document.createElement("div");
    row.classList.add("row");

    row.innerHTML = `
      <div class="medicine-name">${item.medicine}</div>
      <div>${item.quantity}</div>
      <div>${new Date(item.created_at).toLocaleDateString()}</div>
      <div class="flex gap-2 justify-end">
        <button class="edit bg-yellow-400 hover:bg-yellow-500 px-2 py-1 rounded text-white"
                data-id="${item.id_inventory}"
                data-name="${item.medicine}"
                data-qty="${item.quantity}">✏️</button>
        <button class="delete bg-red-500 hover:bg-red-600 px-2 py-1 rounded text-white"
                data-id="${item.id_inventory}">🗑️</button>
      </div>
    `;
    inventoryList.appendChild(row);
  });
}

// ---------------- Load inventory ----------------
async function loadInventory() {
  try {
    const result = await getInventory();
    if (!result.success) {
      console.error(result.message);
      return;
    }
    renderInventory(result.data);
  } catch (err) {
    console.error("Error loading inventory:", err);
  }
}

// ---------------- Add / Update medicine ----------------
medicineForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = hiddenId.value;
  const medicine = inputMedicine.value.trim(); 
  const quantity = inputQuantity.value;

  if (!medicine || !quantity) {
    Swal.fire({
      icon: "warning",
      title: "Missing fields",
      text: "You must provide a medicine name and a quantity",
      confirmButtonColor: "#4f46e5"
    });
    return;
  }

  // If ID exists → update medicine, otherwise → add new one
  if (id) {
    await updateMedicine(id, { quantity });
    Swal.fire({
      icon: "success",
      title: "Updated",
      text: "Medicine updated successfully",
      confirmButtonColor: "#16a34a"
    });
  } else {
    await addMedicine({ medicine, quantity }); 
    Swal.fire({
      icon: "success",
      title: "Added",
      text: "Medicine added successfully",
      confirmButtonColor: "#16a34a"
    });
  }

  // Reset form and reload inventory
  medicineForm.reset();
  hiddenId.value = "";
  loadInventory();
});

// ---------------- Edit / Delete medicine ----------------
inventoryList.addEventListener("click", async (e) => {
  if (e.target.classList.contains("delete")) {
    const id = e.target.dataset.id;

    const result = await Swal.fire({
      icon: "warning",
      title: "Are you sure?",
      text: "This action cannot be undone!",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it"
    });

    if (result.isConfirmed) {
      await deleteMedicine(id);
      Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "Medicine deleted successfully",
        confirmButtonColor: "#16a34a"
      });
      loadInventory();
    }
  }

  if (e.target.classList.contains("edit")) {
    hiddenId.value = e.target.dataset.id;
    inputMedicine.value = e.target.dataset.name;
    inputQuantity.value = e.target.dataset.qty;
  }
});

// ---------------- Search inventory (real-time, backend) ----------------
if (searchInput) {
  searchInput.addEventListener("input", async () => {
    const query = searchInput.value.trim();

    if (query.length === 0) {
      // Si no hay texto, recargamos todo el inventario
      loadInventory();
      return;
    }

    try {
      const result = await searchInventory(query);
      if (result.success) {
        renderInventory(result.data);
      }
    } catch (err) {
      console.error("Error searching inventory:", err);
    }
  });
}

// ---------------- Init ----------------
loadInventory();
