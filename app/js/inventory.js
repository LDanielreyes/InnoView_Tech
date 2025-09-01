import { logout } from "./router.js";
import { getInventory, addMedicine, updateMedicine, deleteMedicine } from "./api.js";

// ---------------- Logout ----------------
document.querySelectorAll(".logout").forEach((btn) =>
  btn.addEventListener("click", logout)
);

// ---------------- DOM Elements ----------------
const medicineForm = document.getElementById("medicineForm");
const inventoryList = document.getElementById("inventoryList");
const hiddenId = document.getElementById("medicineId");
const inputMedicine = document.getElementById("medicineName"); // 👈 ahora input de texto
const inputQuantity = document.getElementById("quantity");

// ---------------- Load inventory into the table ----------------
async function loadInventory() {
  try {
    const result = await getInventory();
    if (!result.success) {
      console.error(result.message);
      return;
    }

    inventoryList.innerHTML = "";

    result.data.forEach((item) => {
      const row = document.createElement("div");
      row.classList.add("row");

      row.innerHTML = `
        <div>${item.medicine}</div>
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
  } catch (err) {
    console.error("Error loading inventory:", err);
  }
}

// ---------------- Add / Update ----------------
medicineForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = hiddenId.value;
  const name = inputMedicine.value.trim(); // 👈 texto libre
  const quantity = inputQuantity.value;

  if (!name || !quantity) {
    alert("Debe escribir el nombre del medicamento y una cantidad");
    return;
  }

  if (id) {
    await updateMedicine(id, { quantity });
  } else {
    await addMedicine({ name, quantity }); // 👈 ahora enviamos `name`
  }

  medicineForm.reset();
  hiddenId.value = "";
  loadInventory();
});

// ---------------- Edit / Delete Actions ----------------
inventoryList.addEventListener("click", async (e) => {
  if (e.target.classList.contains("delete")) {
    const id = e.target.dataset.id;
    if (confirm("¿Eliminar este medicamento?")) {
      await deleteMedicine(id);
      loadInventory();
    }
  }

  if (e.target.classList.contains("edit")) {
    hiddenId.value = e.target.dataset.id;
    inputMedicine.value = e.target.dataset.name; // 👈 cargamos nombre
    inputQuantity.value = e.target.dataset.qty;
  }
});

// ---------------- Init ----------------
loadInventory();
