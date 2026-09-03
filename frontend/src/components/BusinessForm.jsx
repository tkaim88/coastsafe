import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { searchLocations } from "../services/geocodingApi"; // adjust path if different
import { resolveLocation } from "../services/locationsApi";
import { createBusiness } from "../services/businessesApi";

const FACILITY_TYPES = [
  { value: "swimming_pool", label: "Swimming Pool" },
  { value: "water_park", label: "Water Park" },
  { value: "beach_resort", label: "Beach Resort" },
  { value: "lodge", label: "Lodge" },
  { value: "other", label: "Other" },
];

function BusinessForm({ onCreated }) {
  const { accessToken: token } = useAuth();

  const [locationQuery, setLocationQuery] = useState("");
  const [locationResults, setLocationResults] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searching, setSearching] = useState(false);

  const [name, setName] = useState("");
  const [facilityType, setFacilityType] = useState("swimming_pool");
  const [description, setDescription] = useState("");
  const [lifeguardAvailable, setLifeguardAvailable] = useState(false);
  const [lifeguardHours, setLifeguardHours] = useState("");
  const [amenitiesText, setAmenitiesText] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  async function handleLocationSearch(event) {
    const query = event.target.value;
    setLocationQuery(query);
    setSelectedLocation(null);

    if (query.trim().length < 2) {
      setLocationResults([]);
      return;
    }

    setSearching(true);
    try {
      const results = await searchLocations(query);
      setLocationResults(results);
    } catch {
      setLocationResults([]);
    } finally {
      setSearching(false);
    }
  }

  function handleSelectLocation(result) {
    setSelectedLocation(result);
    setLocationQuery(result.name);
    setLocationResults([]);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);

    if (!selectedLocation) {
      setError("Please search for and select a location.");
      return;
    }
    if (!name.trim()) {
      setError("Business name is required.");
      return;
    }

    setSubmitting(true);
    try {
      const location = await resolveLocation(token, {
        name: selectedLocation.name,
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
        region: selectedLocation.admin1,
        country: selectedLocation.country,
        waterType: "beach",
      });

      const amenities = amenitiesText
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      await createBusiness(token, {
        locationId: location.id,
        name: name.trim(),
        facilityType,
        description,
        lifeguardAvailable,
        lifeguardHours,
        amenities,
        contactPhone,
        contactEmail,
      });

      setSuccess(true);
      onCreated?.();
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-xl border border-turquoise/30 bg-turquoise/10 p-6 text-center">
        <p className="text-lg font-semibold text-ink">Listing submitted! 🎉</p>
        <p className="mt-1 text-sm text-ink/70">
          Your facility is now awaiting admin review. It won't appear publicly until approved.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg border border-coral/30 bg-coral/10 px-4 py-2 text-sm text-coral">
          {error}
        </div>
      )}

      <div className="relative">
        <label className="block text-sm font-medium text-ink/80">Location</label>
        <input
          type="text"
          value={locationQuery}
          onChange={handleLocationSearch}
          placeholder="Search any coastal location..."
          className="mt-1 w-full rounded-lg border border-turquoise/25 bg-white px-4 py-2 text-ink outline-none focus:ring-4 focus:ring-turquoise/20"
        />
        {searching && <p className="mt-1 text-xs text-ink/50">Searching...</p>}
        {locationResults.length > 0 && (
          <ul className="absolute z-10 mt-1 w-full rounded-lg border border-turquoise/15 bg-white shadow-lg">
            {locationResults.map((result, i) => (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => handleSelectLocation(result)}
                  className="block w-full px-4 py-2 text-left text-sm text-ink hover:bg-turquoise/5"
                >
                  {result.name}
                  {result.admin1 ? `, ${result.admin1}` : ""}
                  {result.country ? `, ${result.country}` : ""}
                </button>
              </li>
            ))}
          </ul>
        )}
        {selectedLocation && (
          <p className="mt-1 text-xs text-deep">✓ Location selected</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-ink/80">Facility name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded-lg border border-turquoise/25 bg-white px-4 py-2 text-ink outline-none focus:ring-4 focus:ring-turquoise/20"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-ink/80">Facility type</label>
        <select
          value={facilityType}
          onChange={(e) => setFacilityType(e.target.value)}
          className="mt-1 w-full rounded-lg border border-turquoise/25 bg-white px-4 py-2 text-ink outline-none focus:ring-4 focus:ring-turquoise/20"
        >
          {FACILITY_TYPES.map((type) => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-ink/80">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1 w-full rounded-lg border border-turquoise/25 bg-white px-4 py-2 text-ink outline-none focus:ring-4 focus:ring-turquoise/20"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="lifeguardAvailable"
          checked={lifeguardAvailable}
          onChange={(e) => setLifeguardAvailable(e.target.checked)}
          className="h-4 w-4 accent-turquoise"
        />
        <label htmlFor="lifeguardAvailable" className="text-sm text-ink/80">
          Lifeguard on duty
        </label>
      </div>

      {lifeguardAvailable && (
        <div>
          <label className="block text-sm font-medium text-ink/80">Lifeguard hours</label>
          <input
            type="text"
            value={lifeguardHours}
            onChange={(e) => setLifeguardHours(e.target.value)}
            placeholder="e.g. 9am–6pm daily"
            className="mt-1 w-full rounded-lg border border-turquoise/25 bg-white px-4 py-2 text-ink outline-none focus:ring-4 focus:ring-turquoise/20"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-ink/80">
          Amenities <span className="text-ink/50">(comma-separated)</span>
        </label>
        <input
          type="text"
          value={amenitiesText}
          onChange={(e) => setAmenitiesText(e.target.value)}
          placeholder="e.g. parking, changing rooms, slides"
          className="mt-1 w-full rounded-lg border border-turquoise/25 bg-white px-4 py-2 text-ink outline-none focus:ring-4 focus:ring-turquoise/20"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-ink/80">Contact phone</label>
          <input
            type="text"
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
            className="mt-1 w-full rounded-lg border border-turquoise/25 bg-white px-4 py-2 text-ink outline-none focus:ring-4 focus:ring-turquoise/20"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink/80">Contact email</label>
          <input
            type="email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-turquoise/25 bg-white px-4 py-2 text-ink outline-none focus:ring-4 focus:ring-turquoise/20"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-xl bg-turquoise px-6 py-3 font-semibold text-white transition hover:bg-deep disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? "Submitting..." : "Submit Listing for Review"}
      </button>
    </form>
  );
}

export default BusinessForm;