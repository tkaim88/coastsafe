import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { listPendingBusinesses, setBusinessStatus, deleteBusiness } from "../services/businessesApi";

function AdminReviewQueue() {
  const { accessToken: token } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await listPendingBusinesses(token);
      setListings(data.items ?? data);
    } catch (err) {
      setError(err.message || "Failed to load pending listings.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleDecision(id, status) {
    try {
      await setBusinessStatus(token, id, status);
      setListings((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      alert(err.message || "Failed to update listing.");
    }
  }

  async function handleDelete(id) {
    if (!confirm("Permanently delete this listing?")) return;
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
        <h1 className="font-display text-2xl font-medium text-ink">Pending Business Listings</h1>

        {loading && <p className="mt-6 text-ink/60">Loading...</p>}
        {error && (
          <p className="mt-6 text-coral">
            {error}
            {error.toLowerCase().includes("admin") && " — this page is admin-only."}
          </p>
        )}

        {!loading && !error && listings.length === 0 && (
          <p className="mt-6 text-ink/60">No listings awaiting review.</p>
        )}

        <div className="mt-6 space-y-4">
          {listings.map((business) => (
            <div key={business.id} className="rounded-xl border border-turquoise/15 bg-cream p-5">
              <h2 className="text-lg font-semibold text-ink">{business.name}</h2>
              <p className="text-sm text-ink/60">
                {business.location_name} · {business.facility_type.replace("_", " ")}
              </p>
              {business.description && (
                <p className="mt-2 text-sm text-ink/70">{business.description}</p>
              )}
              {business.lifeguard_available && (
                <p className="mt-2 text-sm text-deep">
                  🛟 Lifeguard on duty {business.lifeguard_hours ? `— ${business.lifeguard_hours}` : ""}
                </p>
              )}
              {business.amenities?.length > 0 && (
                <p className="mt-1 text-xs text-ink/50">
                  Amenities: {business.amenities.join(", ")}
                </p>
              )}
              <p className="mt-1 text-xs text-ink/40">
                Contact: {business.contact_phone || "—"} · {business.contact_email || "—"}
              </p>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => handleDecision(business.id, "approved")}
                  className="rounded-lg bg-turquoise px-4 py-1.5 text-sm font-semibold text-white hover:bg-deep"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleDecision(business.id, "rejected")}
                  className="rounded-lg border border-coral/30 px-4 py-1.5 text-sm text-coral hover:bg-coral/10"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleDelete(business.id)}
                  className="rounded-lg border border-ink/20 px-4 py-1.5 text-sm text-ink/60 hover:bg-ink/5"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default AdminReviewQueue;