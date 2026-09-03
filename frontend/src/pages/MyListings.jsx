import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { listMyBusinesses, updateBusiness, deleteBusiness } from "../services/businessesApi";

const STATUS_STYLES = {
  pending: "bg-sun/20 text-sun border-sun/40",
  approved: "bg-turquoise/15 text-deep border-turquoise/30",
  rejected: "bg-coral/15 text-coral border-coral/30",
};

function EditListingForm({ business, token, onSaved, onCancel }) {
  const [name, setName] = useState(business.name);
  const [description, setDescription] = useState(business.description || "");
  const [lifeguardAvailable, setLifeguardAvailable] = useState(business.lifeguard_available);
  const [lifeguardHours, setLifeguardHours] = useState(business.lifeguard_hours || "");
  const [amenities, setAmenities] = useState((business.amenities || []).join(", "));
  const [contactPhone, setContactPhone] = useState(business.contact_phone || "");
  const [contactEmail, setContactEmail] = useState(business.contact_email || "");
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await updateBusiness(token, business.id, {
        name,
        description,
        lifeguardAvailable,
        lifeguardHours,
        amenities: amenities.split(",").map((a) => a.trim()).filter(Boolean),
        contactPhone,
        contactEmail,
      });
      onSaved();
    } catch (err) {
      setError(err.message || "Failed to update listing.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3 border-t border-turquoise/15 pt-4">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        className="w-full rounded-lg border border-turquoise/25 bg-white px-3 py-2 text-sm text-ink"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        rows={2}
        className="w-full rounded-lg border border-turquoise/25 bg-white px-3 py-2 text-sm text-ink"
      />

      <label className="flex items-center gap-2 text-sm text-ink/70">
        <input
          type="checkbox"
          checked={lifeguardAvailable}
          onChange={(e) => setLifeguardAvailable(e.target.checked)}
        />
        Lifeguard available
      </label>

      {lifeguardAvailable && (
        <input
          value={lifeguardHours}
          onChange={(e) => setLifeguardHours(e.target.value)}
          placeholder="Lifeguard hours, e.g. 9am–6pm daily"
          className="w-full rounded-lg border border-turquoise/25 bg-white px-3 py-2 text-sm text-ink"
        />
      )}

      <input
        value={amenities}
        onChange={(e) => setAmenities(e.target.value)}
        placeholder="Amenities (comma-separated)"
        className="w-full rounded-lg border border-turquoise/25 bg-white px-3 py-2 text-sm text-ink"
      />

      <div className="grid grid-cols-2 gap-3">
        <input
          value={contactPhone}
          onChange={(e) => setContactPhone(e.target.value)}
          placeholder="Contact phone"
          className="w-full rounded-lg border border-turquoise/25 bg-white px-3 py-2 text-sm text-ink"
        />
        <input
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
          placeholder="Contact email"
          className="w-full rounded-lg border border-turquoise/25 bg-white px-3 py-2 text-sm text-ink"
        />
      </div>

      {error && <p className="text-sm text-coral">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-turquoise px-4 py-1.5 text-sm font-semibold text-white hover:bg-deep disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-turquoise/25 px-4 py-1.5 text-sm text-ink/70 hover:bg-turquoise/5"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function MyListings() {
  const { accessToken: token } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await listMyBusinesses(token);
      setListings(data.items ?? data);
    } catch (err) {
      setError(err.message || "Failed to load your listings.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleDelete(id) {
    if (!confirm("Delete this listing? This cannot be undone.")) return;
    try {
      await deleteBusiness(token, id);
      setListings((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      alert(err.message || "Failed to delete listing.");
    }
  }

  return (
    <main className="min-h-screen bg-lagoon">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-medium text-ink">My Listings</h1>
          <Link
            to="/list-your-business"
            className="rounded-lg bg-turquoise px-4 py-2 text-sm font-semibold text-white hover:bg-deep"
          >
            + New Listing
          </Link>
        </div>

        {loading && <p className="mt-6 text-ink/60">Loading...</p>}
        {error && <p className="mt-6 text-coral">{error}</p>}

        {!loading && !error && listings.length === 0 && (
          <p className="mt-6 text-ink/60">
            You haven't listed a business yet.{" "}
            <Link to="/list-your-business" className="text-deep underline">
              List one now
            </Link>
            .
          </p>
        )}

        <div className="mt-6 space-y-4">
          {listings.map((business) => (
            <div key={business.id} className="rounded-xl border border-turquoise/15 bg-cream p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-ink">{business.name}</h2>
                  <p className="text-sm text-ink/60">
                    {business.location_name} · {business.facility_type.replace("_", " ")}
                  </p>
                </div>
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-medium capitalize ${STATUS_STYLES[business.status]}`}
                >
                  {business.status}
                </span>
              </div>

              {business.lifeguard_available && (
                <p className="mt-2 text-sm text-deep">
                  🛟 Lifeguard on duty {business.lifeguard_hours ? `— ${business.lifeguard_hours}` : ""}
                </p>
              )}

              {editingId === business.id ? (
                <EditListingForm
                  business={business}
                  token={token}
                  onSaved={() => { setEditingId(null); load(); }}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => setEditingId(business.id)}
                    className="rounded-lg border border-turquoise/30 px-3 py-1.5 text-sm text-deep hover:bg-turquoise/10"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(business.id)}
                    className="rounded-lg border border-coral/30 px-3 py-1.5 text-sm text-coral hover:bg-coral/10"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default MyListings;