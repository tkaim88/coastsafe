import { useEffect, useState } from "react";
import { listBusinesses } from "../services/businessesApi";

function LocationBusinesses({ backendLocationId }) {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!backendLocationId) {
      setLoading(false);
      return;
    }
    listBusinesses({ locationId: backendLocationId })
      .then((data) => setListings(data.items ?? data))
      .catch(() => setListings([]))
      .finally(() => setLoading(false));
  }, [backendLocationId]);

  if (!backendLocationId || loading) return null;

  if (listings.length === 0) {
    return (
      <p className="text-sm text-slate-500">
        No verified facilities listed here yet.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {listings.map((business) => (
        <div
          key={business.id}
          className="rounded-xl border border-slate-100 bg-slate-50 p-4"
        >
          <h3 className="font-semibold text-slate-900">{business.name}</h3>
          <p className="text-xs capitalize text-slate-500">
            {business.facility_type.replace("_", " ")}
          </p>
          {business.lifeguard_available ? (
            <p className="mt-2 text-sm font-medium text-cyan-700">
              🛟 Lifeguard on duty{" "}
              {business.lifeguard_hours ? `— ${business.lifeguard_hours}` : ""}
            </p>
          ) : (
            <p className="mt-2 text-sm text-slate-400">No lifeguard on duty</p>
          )}
          {business.amenities?.length > 0 && (
            <p className="mt-1 text-xs text-slate-500">
              {business.amenities.join(" · ")}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

export default LocationBusinesses;
