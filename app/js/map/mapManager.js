// ==========================
// mapManager.js
// Logic to initialize and manage the map
// ==========================

let map;
let markersGroup;
let routingControl = null; //  reference to the active route

/**
 * Initializes the Leaflet map with the default view.
 */
export function initMap() {
  // If map already exists, do not create it again
  if (map) return;

  map = L.map("map").setView([10.9685, -74.7813], 13); // Default: Barranquilla

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap contributors",
  }).addTo(map);

  markersGroup = L.layerGroup().addTo(map);
}

/**
 * Adds markers to the map and adjusts the zoom to make them visible.
 * @param {Array<Object>} points - Pharmacy points with availability.
 * @param {Array<number> | null} userLocation - User coordinates.
 */
export function addMarkersToMap(points, userLocation) {
  const bounds = L.latLngBounds([]);

  //  User location marker
  if (userLocation) {
    const userIcon = L.icon({
      iconUrl: "../img/pin-de-ubicacion%201.png",
      iconSize: [38, 38],
      iconAnchor: [19, 38],
      popupAnchor: [0, -30],
    });

    L.marker(userLocation, { icon: userIcon })
      .addTo(markersGroup)
      .bindPopup("You are here!")
      .openPopup();

    bounds.extend(userLocation);
  }

  //  Pharmacy markers
  points.forEach((point) => {
    if (point.latitude && point.longitude) {
      const marker = L.marker([point.latitude, point.longitude])
        .addTo(markersGroup)
        .bindPopup(
          `<b>${point.point_name}</b><br>${point.address}<br>Stock: ${point.quantity}`
        );

      //  On marker click → draw route from user location
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
 * Clears all markers from the map.
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
 * Draws a route from the user’s location to the selected pharmacy point.
 * @param {Array<number>} start - User coordinates [lat, lng]
 * @param {Array<number>} end - Destination coordinates [lat, lng]
 */
export function showRoute(start, end) {
  if (!map) return;

  // Remove previous route if exists
  if (routingControl) {
    map.removeControl(routingControl);
  }

  routingControl = L.Routing.control({
    waypoints: [
      L.latLng(start[0], start[1]),
      L.latLng(end[0], end[1]),
    ],
    routeWhileDragging: false,
    addWaypoints: false,
    lineOptions: {
      styles: [{ color: "blue", opacity: 0.8, weight: 5 }],
    },
  }).addTo(map);
}
