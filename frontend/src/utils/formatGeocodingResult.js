/**
 * Normalizes a raw Open-Meteo geocoding result into the same shape
 * used by coastalLocations.js, so search results and curated
 * locations can flow through the same LocationDetails page.
 */
export function formatGeocodingResult(raw) {
  return {
    id: `geo-${raw.id}`,
    name: raw.name,
    region: raw.admin1 ?? raw.admin2 ?? "",
    country: raw.country ?? "",
    latitude: raw.latitude,
    longitude: raw.longitude,
    description: [raw.admin1, raw.country].filter(Boolean).join(", "),
    isSearchResult: true,
  };
}