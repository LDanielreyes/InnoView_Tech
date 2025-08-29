// ==========================
// mapManager.js
// Lógica para inicializar y gestionar el mapa
// ==========================

let map;
let markersGroup;

/**
 * Inicializa el mapa Leaflet en la vista predeterminada.
 */
export function initMap() {
    map = L.map("map").setView([10.9685, -74.7813], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "© OpenStreetMap contributors",
    }).addTo(map);
    markersGroup = L.layerGroup().addTo(map);
}

/**
 * Añade los marcadores al mapa y ajusta el zoom para que sean visibles.
 * @param {Array<Object>} points - Los puntos de farmacia con disponibilidad.
 * @param {Array<number> | null} userLocation - Coordenadas del usuario.
 */
export function addMarkersToMap(points, userLocation) {
    const bounds = L.latLngBounds([]);

    if (userLocation) {
        const userIcon = L.icon({
            iconUrl: '../img/pin-de-ubicacion%201.png',
            iconSize: [38, 38],
            iconAnchor: [19, 38],
            popupAnchor: [0, -30]
        });
        L.marker(userLocation, { icon: userIcon }).addTo(markersGroup).bindPopup("¡Estás aquí!").openPopup();
        bounds.extend(userLocation);
    }

    points.forEach(point => {
        if (point.latitude && point.longitude) {
            const marker = L.marker([point.latitude, point.longitude])
                .addTo(markersGroup)
                .bindPopup(`<b>${point.point_name}</b><br>${point.address}<br>Stock: ${point.quantity}`);
            bounds.extend(marker.getLatLng());
        }
    });

    if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50] });
    }
}

/**
 * Limpia todos los marcadores del mapa.
 */
export function clearMarkers() {
    if (markersGroup) {
        markersGroup.clearLayers();
    }
}