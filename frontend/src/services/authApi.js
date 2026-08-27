import { apiRequest } from "./apiClient";

export function signup({ name, email, password, role }) {
  return apiRequest("/auth/signup", {
    method: "POST",
    body: { name, email, password, role },
  });
}

export function login({ email, password }) {
  return apiRequest("/auth/login", {
    method: "POST",
    body: { email, password },
  });
}

export function logout(token) {
  return apiRequest("/auth/logout", { method: "POST", token });
}

export function fetchCurrentUser(token) {
  return apiRequest("/auth/me", { token });
}
