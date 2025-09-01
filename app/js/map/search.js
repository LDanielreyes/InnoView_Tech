// ==========================
// search.js
// Main entry point and orchestrator for medicine search
// ==========================

import { initMap, addMarkersToMap, clearMarkers } from "./mapManager.js";
import { searchMedicine } from "./api_map.js";
import { updateResultsList, setUserLocation } from "./uiManager.js";
import { logout } from "../router.js";

// Redirect if the user is not authenticated as "user"
const user = JSON.parse(localStorage.getItem("user"));
if (!user) {
  window.location.href = "../../index.html";
}

// CONSTANTS AND DOM SELECTORS
const medicineInput = document.getElementById("medicine");
const searchForm = document.getElementById("searchForm");
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", logout);
}

// GLOBAL VARIABLES
let userLocation = null;

/**
 * Initializes the application when DOM is loaded.
 */
function init() {
  initMap();
  setupEventListeners();
}

/**
 * Sets up page event listeners.
 */
function setupEventListeners() {
  if (searchForm) {
    searchForm.addEventListener("submit", handleSearchFormSubmit);
  }
}

/**
 * Handles the search form submission event.
 * @param {Event} e - The form submission event.
 */
async function handleSearchFormSubmit(e) {
  e.preventDefault();

  const medicineName = medicineInput.value.trim();
  if (!medicineName) {
    Swal.fire({
      icon: "warning",
      title: "Missing field",
      text: "Please enter a medicine name.",
      confirmButtonColor: "#4f46e5"
    });
    return;
  }

  clearMarkers();
  // Show loading state while waiting for API response
  updateResultsList([{ loading: true }], medicineName);

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        userLocation = [position.coords.latitude, position.coords.longitude];
        setUserLocation(userLocation); // save in uiManager
        await performSearch(medicineName);
      },
      async (error) => {
        console.error("Error getting user location:", error);
        Swal.fire({
          icon: "info",
          title: "Location unavailable",
          text: "Could not get your location. Searching pharmacies without your position.",
          confirmButtonColor: "#4f46e5"
        });
        userLocation = null;
        setUserLocation(null); // clear in uiManager
        await performSearch(medicineName);
      }
    );
  } else {
    Swal.fire({
      icon: "info",
      title: "Geolocation not supported",
      text: "Your browser does not support geolocation. Searching pharmacies without your position.",
      confirmButtonColor: "#4f46e5"
    });
    userLocation = null;
    setUserLocation(null);
    await performSearch(medicineName);
  }
}

/**
 * Orchestrates the API call and UI update.
 * @param {string} medicineName - Name of the medicine.
 */
async function performSearch(medicineName) {
  try {
    const authorizedPoints = await searchMedicine(medicineName);
    addMarkersToMap(authorizedPoints, userLocation);
    updateResultsList(authorizedPoints, medicineName);
  } catch (err) {
    console.error("Error during search:", err);
    Swal.fire({
      icon: "error",
      title: "Search error",
      text: "An error occurred while searching. Please try again.",
      confirmButtonColor: "#dc2626"
    });
  }
}

// Initialize the application when DOM is ready
document.addEventListener("DOMContentLoaded", init);
