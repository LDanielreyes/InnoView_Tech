import axios from "axios";

export async function geocodeAddress(address) {
  const fullAddress = `${address}, Barranquilla, Colombia`;

  try {
    const response = await axios.get("https://nominatim.openstreetmap.org/search", {
      params: {
        q: fullAddress,
        format: "json",
        limit: 1
      },
      headers: {
        'User-Agent': 'mediAqui/1.0 (lucasdanielchaconr@gmail.com)'
      }
    });

    if (response.data.length === 0) return null;

    const location = response.data[0];
    return {
      latitude: parseFloat(location.lat),
      longitude: parseFloat(location.lon)
    };
  } catch (err) {
    console.error("Geocoding error:", err.message);
    return null;
  }
}
