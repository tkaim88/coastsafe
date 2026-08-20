const GEOCODING_BASE_URL = "https://geocoding-api.open-meteo.com/v1/search";

/**
 * Resolves a free-text place name into candidate locations with coordinates.
 * @param {string} query
 * @returns {Promise<Array<object>>} array of matches (empty if none found)
 */
export async function searchLocations(query) {
  const trimmed = query.trim();

  if (!trimmed) {
    return [];
  }

  const params = new URLSearchParams({
    name: trimmed,
    count: 10,
    language: "en",
    format: "json",
  });

  const response = await fetch(`${GEOCODING_BASE_URL}?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`Geocoding API request failed with status ${response.status}`);
  }

  const data = await response.json();
  return data.results ?? [];
}