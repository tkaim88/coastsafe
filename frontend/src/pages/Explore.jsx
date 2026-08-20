import { useMemo, useState } from "react";
import LocationCard from "../components/LocationCard";
import { coastalLocations } from "../data/coastalLocations";

function Explore() {
  const [query, setQuery] = useState("");

  const filteredLocations = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return coastalLocations;
    }

    return coastalLocations.filter((location) =>
      `${location.name} ${location.region} ${location.country}`
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [query]);

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-cyan-300">
            Explore
          </p>

          <h1 className="mt-2 text-4xl font-black sm:text-5xl">
            Find a coastal destination.
          </h1>

          <p className="mt-4 max-w-2xl text-slate-300">
            Browse popular Kenyan coastal destinations or search for a
            location below.
          </p>

          <div className="mt-8 max-w-xl">
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search Mombasa, Diani, Watamu..."
              className="w-full rounded-xl border border-white/20 bg-white px-5 py-4 text-slate-900 outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/20"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {filteredLocations.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
            <p className="text-4xl">🔎</p>
            <h2 className="mt-4 text-xl font-bold text-slate-900">
              No locations found
            </h2>
            <p className="mt-2 text-slate-500">
              Try a different coastal location.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredLocations.map((location) => (
              <LocationCard key={location.id} location={location} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Explore;