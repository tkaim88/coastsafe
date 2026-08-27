import { apiRequest } from "./apiClient";

// Simple in-module cache — the backend location list is small and static
// within a session, so there's no need to refetch it on every page visit.
let cachedBackendLocations = null;

async function getBackendLocations() {
  if (cachedBackendLocations === null) {
    cachedBackendLocations = await apiRequest("/locations");
  }
  return cachedBackendLocations;
}

/**
 * Resolves a frontend location (from either the curated coastalLocations
 * list or an Open-Meteo geocoding search result) to its numeric backend
 * Location ID, by matching on name.
 *
 * Returns null if there's no backend match yet — callers should treat
 * that as "reporting isn't available here yet", not as an error, since
 * it's an expected state for locations found via free-text search that
 * haven't been added to the backend.
 *
 * @param {{ name: string }} location
 * @returns {Promise<number|null>}
 */
export async function resolveBackendLocationId(location) {
  if (!location?.name) return null;

  const backendLocations = await getBackendLocations();
  const match = backendLocations.find(
    (loc) => loc.name.trim().toLowerCase() === location.name.trim().toLowerCase()
  );

  return match ? match.id : null;
}
