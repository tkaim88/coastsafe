import { API_BASE_URL } from "../config";

/**
 * Shared fetch wrapper used by every service file (authApi, reportsApi,
 * locationsApi, and future businessApi). Centralizing this means auth
 * headers, JSON handling, and error parsing are written once — not
 * re-implemented slightly differently in each service file.
 *
 * @param {string} path - e.g. "/auth/login" (appended to API_BASE_URL)
 * @param {object} options
 * @param {string} [options.method="GET"]
 * @param {string} [options.token] - JWT access token, if the route requires auth
 * @param {object} [options.body] - request body, JSON-stringified automatically
 */
export async function apiRequest(path, { method = "GET", token, body } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  // The backend always returns JSON (see app/utils/errors.py), so this is
  // safe even for error responses — but guard against a truly empty body.
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = data?.error || `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return data;
}
