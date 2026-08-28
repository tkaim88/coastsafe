import { apiRequest } from "./apiClient";

export function listBusinesses({ locationId, lifeguardOnly, page = 1, perPage = 10 } = {}) {
  const query = new URLSearchParams({ page, per_page: perPage });
  if (locationId) query.set("location_id", locationId);
  if (lifeguardOnly) query.set("lifeguard_available", "true");
  return apiRequest(`/businesses?${query.toString()}`);
}

export function getBusiness(businessId) {
  return apiRequest(`/businesses/${businessId}`);
}

export function listMyBusinesses(token, { page = 1, perPage = 10 } = {}) {
  const query = new URLSearchParams({ page, per_page: perPage });
  return apiRequest(`/businesses/mine?${query.toString()}`, { token });
}

export function listPendingBusinesses(token, { page = 1, perPage = 10 } = {}) {
  const query = new URLSearchParams({ page, per_page: perPage });
  return apiRequest(`/businesses/pending?${query.toString()}`, { token });
}

export function createBusiness(token, fields) {
  return apiRequest("/businesses", {
    method: "POST",
    token,
    body: {
      location_id: fields.locationId,
      name: fields.name,
      facility_type: fields.facilityType,
      description: fields.description,
      lifeguard_available: fields.lifeguardAvailable,
      lifeguard_hours: fields.lifeguardHours,
      amenities: fields.amenities,
      contact_phone: fields.contactPhone,
      contact_email: fields.contactEmail,
    },
  });
}

export function updateBusiness(token, businessId, fields) {
  const body = {};
  if (fields.name !== undefined) body.name = fields.name;
  if (fields.facilityType !== undefined) body.facility_type = fields.facilityType;
  if (fields.description !== undefined) body.description = fields.description;
  if (fields.lifeguardAvailable !== undefined) body.lifeguard_available = fields.lifeguardAvailable;
  if (fields.lifeguardHours !== undefined) body.lifeguard_hours = fields.lifeguardHours;
  if (fields.amenities !== undefined) body.amenities = fields.amenities;
  if (fields.contactPhone !== undefined) body.contact_phone = fields.contactPhone;
  if (fields.contactEmail !== undefined) body.contact_email = fields.contactEmail;
  return apiRequest(`/businesses/${businessId}`, { method: "PATCH", token, body });
}

export function deleteBusiness(token, businessId) {
  return apiRequest(`/businesses/${businessId}`, { method: "DELETE", token });
}

export function setBusinessStatus(token, businessId, status) {
  return apiRequest(`/businesses/${businessId}/status`, {
    method: "PATCH",
    token,
    body: { status },
  });
}
