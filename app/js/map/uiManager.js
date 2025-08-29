// ==========================
// uiManager.js
// Lógica para actualizar la interfaz de usuario (UI)
// ==========================

const pointsList = document.getElementById("pointsList");

/**
 * Actualiza la lista de resultados en la UI.
 * @param {Array<Object>} points - Los puntos de farmacia a listar.
 * @param {string} medicineName - Nombre del medicamento para mensajes sin resultados.
 */
export function updateResultsList(points, medicineName) {
    pointsList.innerHTML = "";

    if (points.length === 0) {
        pointsList.innerHTML = `<li class="no-results">No se encontraron medicamentos para **${medicineName}** en las farmacias afiliadas.</li>`;
    } else {
        points.forEach(point => {
            const li = document.createElement("li");
            li.classList.add("points-list__item");
            li.innerHTML = `
                <div class="points-list__name">${point.point_name}</div>
                <div class="points-list__address">${point.address}</div>
                <div class="points-list__stock">
                    <span class="pill pill--success">Disponible</span>
                    <span class="pill pill--stock">Stock: ${point.quantity}</span>
                </div>
            `;
            pointsList.appendChild(li);
        });
    }
}