/**
 * Single source of truth for the backend API's base URL. Every service
 * file imports this instead of hardcoding "http://localhost:5000/api" —
 * changing environments (local -> deployed) means editing one .env value,
 * not hunting through every service file.
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
