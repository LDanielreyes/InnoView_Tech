// ==========================
// uiManager.js
// Logic to update the User Interface (UI)
// ==========================

import { showRoute } from "./mapManager.js"; //  we use showRoute to draw routes
let userLocationRef = null; // store user location reference

const pointsList = document.getElementById("pointsList");

/**
 * Save the current user location to be used for routes.
 * @param {Array<number>} location - [lat, lng] of the user
 */
export function setUserLocation(location) {
  userLocationRef = location;
}

/**
 * Updates the results list in the UI.
 * @param {Array<Object>} points - Pharmacy points to display.
 * @param {string} medicineName - Medicine name for "no results" messages.
 */
export function updateResultsList(points, medicineName) {
  pointsList.innerHTML = "";

  //  Loading state
  if (points.length > 0 && points[0].loading) {
    pointsList.innerHTML = `
      <li class="p-4 bg-white rounded-lg shadow text-slate-600 animate-pulse">
        Searching availability...
      </li>
    `;
    return;
  }

  //  No results found
  if (points.length === 0) {
    pointsList.innerHTML = `
      <li class="p-4 bg-white rounded-lg shadow text-slate-600">
        No medicines found for <b>${medicineName}</b> in affiliated pharmacies.
      </li>
    `;
    return;
  }

  //  Results found
  points.forEach((point) => {
    const li = document.createElement("li");
    li.className =
      "p-4 bg-white rounded-lg shadow cursor-pointer hover:bg-indigo-50 transition";
    li.innerHTML = `
      <div class="font-bold text-indigo-700">${point.point_name}</div>
      <div class="text-sm text-slate-600">${point.address}</div>
      <div class="text-sm text-slate-500">
        <span class="pill pill--success">Available</span>
        <span class="pill pill--stock">Stock: ${point.quantity}</span>
      </div>
    `;

    //  Click on result item → draw route to pharmacy
    li.addEventListener("click", () => {
      if (userLocationRef) {
        showRoute(userLocationRef, [point.latitude, point.longitude]);
      } else {
        alert("Could not get your location to calculate the route.");
      }
    });

    pointsList.appendChild(li);
  });
}
