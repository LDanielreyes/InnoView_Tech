// =============================
// inventory.js - CRUD Inventory
// =============================

const API_URL = "http://localhost:3000/inventory";
const inventoryList = document.getElementById("inventoryList");

// Form elements
const medicineForm = document.getElementById("medicineForm");
const medicineId = document.getElementById("medicineId");
const nameInput = document.getElementById("name");
const quantityInput = document.getElementById("quantity");
const descriptionInput = document.getElementById("description");

// ---- LIST ALL MEDICINES ----
async function loadInventory() {
  try {
    const res = await fetch(API_URL);
    const medicines = await res.json();

    inventoryList.innerHTML = "";

    medicines.forEach((m) => {
      const row = document.createElement("article");
      row.classList.add("row");
      row.innerHTML = `
        <div class="cell">${m.name}</div>
        <div class="cell">${m.quantity}</div>
        <div class="cell">${m.description || "Sin descripción"}</div>
        <div class="cell">${new Date(m.created_at).toLocaleDateString()}</div>
        <div class="cell right">
          <button class="icon" onclick="editMedicine(${m.id}, '${m.name}', ${m.quantity}, '${m.description || ""}')">
            <img class="icons-crud" src="../img/lapiz.png" alt="Editar">
          </button>
          <button class="icon" onclick="deleteMedicine(${m.id})">
            <img class="icons-crud" src="../img/basura.png" alt="Eliminar">
          </button>
        </div>
      `;
      inventoryList.appendChild(row);
    });
  } catch (err) {
    console.error("Error loading inventory:", err);
  }
}

// ---- CREATE OR UPDATE ----
medicineForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = medicineId.value;
  const data = {
    name: nameInput.value,
    quantity: parseInt(quantityInput.value),
    description: descriptionInput.value,
  };

  try {
    const res = await fetch(id ? `${API_URL}/${id}` : API_URL, {
      method: id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    alert(result.message);

    // Reset form
    medicineId.value = "";
    nameInput.value = "";
    quantityInput.value = "";
    descriptionInput.value = "";

    loadInventory();
  } catch (err) {
    console.error("Error saving medicine:", err);
  }
});

// ---- EDIT MEDICINE ----
function editMedicine(id, name, quantity, description) {
  medicineId.value = id;
  nameInput.value = name;
  quantityInput.value = quantity;
  descriptionInput.value = description;
}

// ---- DELETE MEDICINE ----
async function deleteMedicine(id) {
  if (!confirm("¿Seguro que deseas eliminar este medicamento?")) return;
  try {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    const result = await res.json();
    alert(result.message);
    loadInventory();
  } catch (err) {
    console.error("Error deleting medicine:", err);
  }
}

// ---- INIT ----
loadInventory();
