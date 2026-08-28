import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { listMyBusinesses, deleteBusiness } from "../services/businessesApi";

const STATUS_STYLES = {
  pending: "bg-yellow-400/20 text-yellow-300 border-yellow-400/30",
  approved: "bg-cyan-400/20 text-cyan-300 border-cyan-400/30",
  rejected: "bg-red-400/20 text-red-300 border-red-400/30",
};

function MyListings() {
  const { token } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">My Listings</h1>
        <Link
          to="/list-your-business"
          className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-400"
        >
          + New Listing
        </Link>
      </div>

      {loading && <p className="mt-6 text-slate-400">Loading...</p>}
      {error && <p className="mt-6 text-red-300">{error}</p>}

      {!loading && !error && listings.length === 0 && (
        <p className="mt-6 text-slate-400">
          You haven't listed a business yet.{" "}
          <Link to="/list-your-business" className="text-cyan-400 underline">
            List one now
          </Link>
          .
        </p>
      )}

      <div className="mt-6 space-y-4">
        {listings.map((business) => (
          <div
            key={business.id}
            className="rounded-xl border border-white/10 bg-white/5 p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-white">{business.name}</h2>
                <p className="text-sm text-slate-400">
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
              <p className="mt-2 text-sm text-cyan-300">
                🛟 Lifeguard on duty {business.lifeguard_hours ? `— ${business.lifeguard_hours}` : ""}
              </p>
            )}

            <div className="mt-4 flex gap-3">
              <button
                onClick={() => handleDelete(business.id)}
                className="rounded-lg border border-red-400/30 px-3 py-1.5 text-sm text-red-300 hover:bg-red-400/10"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyListings;
