const MARINE_BASE_URL = "https://marine-api.open-meteo.com/v1/marine";

/**
 * Fetches current marine conditions for a given coordinate pair.
 * Marine API has limited global coverage — some coastal points may
 * return empty/null values even with a 200 response, so callers
 * should treat missing values as "unavailable", not as an error.
 * @param {number} latitude
 * @param {number} longitude
 * @returns {Promise<object>} raw Open-Meteo marine response
 */
export async function fetchMarine(latitude, longitude) {
  const params = new URLSearchParams({
    latitude,
    longitude,
    current: [
      "wave_height",
      "wave_direction",
      "wave_period",
      "sea_surface_temperature",
      "sea_level_height_msl",
    ].join(","),
    timezone: "auto",
  });

  const response = await fetch(`${MARINE_BASE_URL}?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`Marine API request failed with status ${response.status}`);
  }

  return response.json();
}