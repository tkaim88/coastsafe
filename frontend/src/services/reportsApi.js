import { apiRequest } from "./apiClient";

/**
 * @param {object} params
 * @param {number} params.locationId - backend numeric Location ID (not the frontend slug)
 * @param {number} [params.page=1]
 * @param {number} [params.perPage=5]
 */
export function listReports({ locationId, page = 1, perPage = 5 }) {
  const query = new URLSearchParams({
    location_id: locationId,
    page,
    per_page: perPage,
  });
  return apiRequest(`/reports?${query.toString()}`);
}

export function createReport(token, { rating, notes, locationId }) {
  return apiRequest("/reports", {
    method: "POST",
    token,
    body: { rating, notes, location_id: locationId },
  });
}

export function updateReport(token, reportId, { rating, notes }) {
  return apiRequest(`/reports/${reportId}`, {
    method: "PATCH",
    token,
    body: { rating, notes },
  });
}

export function deleteReport(token, reportId) {
  return apiRequest(`/reports/${reportId}`, { method: "DELETE", token });
}
