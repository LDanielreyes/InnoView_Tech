function startMap() {
  // Initialize the map
  const map = new Map('map', {
    center: [0, 0],
    zoom: 2,
  });

  // Add event listeners
  map.on('click', (event) => {
    console.log('Map clicked at:', event.latlng);
  });

  // Return the map instance
  return map;
}