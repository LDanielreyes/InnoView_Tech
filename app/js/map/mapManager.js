// ==========================
// mapManager.js
// Logic to initialize and manage the map
// ==========================

let map;
let markersGroup;
let routingControl = null; // reference to the active route

// Default icon for pharmacies (blue pin)
const pharmacyIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  shadowUrl: "https://unpkg.com/leaflet/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Special icon for the user (red pin)
const userIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://unpkg.com/leaflet/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

/**
 * Initializes the Leaflet map with the default view.
 */
export function initMap() {
  if (map) return; // avoid re-creating map

  map = L.map("map").setView([10.9685, -74.7813], 13); // Default: Barranquilla

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap contributors",
  }).addTo(map);

  markersGroup = L.layerGroup().addTo(map);
}

/**
 * Adds user and pharmacy markers to the map and adjusts the view.
 */
export function addMarkersToMap(points, userLocation) {
  const bounds = L.latLngBounds([]);

  // User location marker
  if (userLocation) {
    L.marker(userLocation, { icon: userIcon })
      .addTo(markersGroup)
      .bindPopup("You are here!")
      .openPopup();

    bounds.extend(userLocation);
  }

  // Pharmacy markers
  points.forEach((point) => {
    if (point.latitude && point.longitude) {
      const marker = L.marker([point.latitude, point.longitude], { icon: pharmacyIcon })
        .addTo(markersGroup)
        .bindPopup(
          `<b>${point.point_name}</b><br>${point.address}<br>Stock: ${point.quantity}`
        );

      // On marker click → draw route from user location
      marker.on("click", () => {
        if (userLocation) {
          showRoute(userLocation, [point.latitude, point.longitude]);
        } else {
          alert("Could not get your location, route calculation is not possible.");
        }
      });

      bounds.extend(marker.getLatLng());
    }
  });

  if (bounds.isValid()) {
    map.fitBounds(bounds, { padding: [50, 50] });
  }
}

/**
 * Clears all markers and any active route.
 */
export function clearMarkers() {
  if (markersGroup) {
    markersGroup.clearLayers();
  }
  if (routingControl) {
    map.removeControl(routingControl);
    routingControl = null;
  }
}

/**
 * Draws a route from the user’s location to the selected pharmacy.
 */
export function showRoute(start, end) {
  if (!map) return;

  if (routingControl) {
    map.removeControl(routingControl);
  }

  routingControl = L.Routing.control({
    waypoints: [L.latLng(start[0], start[1]), L.latLng(end[0], end[1])],
    routeWhileDragging: false,
    addWaypoints: false,
    lineOptions: {
      styles: [{ color: "blue", opacity: 0.8, weight: 5 }],
    },
  }).addTo(map);
}
