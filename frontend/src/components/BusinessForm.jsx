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
  const { token } = useAuth();

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
      // Find-or-create the Location on the backend from the geocoded result.
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
      <div className="rounded-xl border border-cyan-400/30 bg-cyan-400/10 p-6 text-center">
        <p className="text-lg font-semibold text-white">Listing submitted! 🎉</p>
        <p className="mt-1 text-sm text-slate-300">
          Your facility is now awaiting admin review. It won't appear publicly until approved.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-2 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="relative">
        <label className="block text-sm font-medium text-slate-200">Location</label>
        <input
          type="text"
          value={locationQuery}
          onChange={handleLocationSearch}
          placeholder="Search any coastal location..."
          className="mt-1 w-full rounded-lg border border-white/20 bg-white px-4 py-2 text-slate-900 outline-none focus:border-cyan-400"
        />
        {searching && <p className="mt-1 text-xs text-slate-400">Searching...</p>}
        {locationResults.length > 0 && (
          <ul className="absolute z-10 mt-1 w-full rounded-lg border border-white/10 bg-slate-900 shadow-lg">
            {locationResults.map((result, i) => (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => handleSelectLocation(result)}
                  className="block w-full px-4 py-2 text-left text-sm text-slate-200 hover:bg-white/10"
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
          <p className="mt-1 text-xs text-cyan-400">✓ Location selected</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-200">Facility name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded-lg border border-white/20 bg-white px-4 py-2 text-slate-900 outline-none focus:border-cyan-400"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-200">Facility type</label>
        <select
          value={facilityType}
          onChange={(e) => setFacilityType(e.target.value)}
          className="mt-1 w-full rounded-lg border border-white/20 bg-white px-4 py-2 text-slate-900 outline-none focus:border-cyan-400"
        >
          {FACILITY_TYPES.map((type) => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-200">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1 w-full rounded-lg border border-white/20 bg-white px-4 py-2 text-slate-900 outline-none focus:border-cyan-400"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="lifeguardAvailable"
          checked={lifeguardAvailable}
          onChange={(e) => setLifeguardAvailable(e.target.checked)}
          className="h-4 w-4"
        />
        <label htmlFor="lifeguardAvailable" className="text-sm text-slate-200">
          Lifeguard on duty
        </label>
      </div>

      {lifeguardAvailable && (
        <div>
          <label className="block text-sm font-medium text-slate-200">Lifeguard hours</label>
          <input
            type="text"
            value={lifeguardHours}
            onChange={(e) => setLifeguardHours(e.target.value)}
            placeholder="e.g. 9am–6pm daily"
            className="mt-1 w-full rounded-lg border border-white/20 bg-white px-4 py-2 text-slate-900 outline-none focus:border-cyan-400"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-200">
          Amenities <span className="text-slate-400">(comma-separated)</span>
        </label>
        <input
          type="text"
          value={amenitiesText}
          onChange={(e) => setAmenitiesText(e.target.value)}
          placeholder="e.g. parking, changing rooms, slides"
          className="mt-1 w-full rounded-lg border border-white/20 bg-white px-4 py-2 text-slate-900 outline-none focus:border-cyan-400"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-200">Contact phone</label>
          <input
            type="text"
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
            className="mt-1 w-full rounded-lg border border-white/20 bg-white px-4 py-2 text-slate-900 outline-none focus:border-cyan-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-200">Contact email</label>
          <input
            type="email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-white/20 bg-white px-4 py-2 text-slate-900 outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? "Submitting..." : "Submit Listing for Review"}
      </button>
    </form>
  );
}

export default BusinessForm;