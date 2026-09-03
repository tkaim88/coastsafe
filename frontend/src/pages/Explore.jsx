import { useMemo, useState } from "react";
import LocationCard from "../components/LocationCard";
import { coastalLocations } from "../data/coastalLocations";

const EXPLORE_HERO =
  "https://images.pexels.com/photos/18713030/pexels-photo-18713030.jpeg?auto=compress&cs=tinysrgb&w=1600";

function Explore() {
  const [query, setQuery] = useState("");

  const filteredLocations = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return coastalLocations;
    return coastalLocations.filter((location) =>
      `${location.name} ${location.region} ${location.country}`
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [query]);

  return (
    <main className="min-h-screen bg-lagoon">
      <section className="relative isolate overflow-hidden bg-turquoise text-white">
        {/* Single restrained photo layer — no page background photo behind
            the tiles too, so there's one clear visual moment, not two. */}
        <div className="absolute inset-0 aspect-[16/6] overflow-hidden">
          <img
            src={EXPLORE_HERO}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-turquoise/70 via-turquoise/60 to-turquoise" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-cream/90">
            Explore
          </p>
          <h1 className="mt-2 font-display text-4xl font-medium sm:text-5xl">
            Find a coastal destination.
          </h1>
          <p className="mt-4 max-w-2xl text-white/85">
            Browse popular Kenyan coastal destinations or search for a
            location below.
          </p>

          <div className="mt-8 max-w-xl">
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search Mombasa, Diani, Watamu..."
              className="w-full rounded-xl border border-white/30 bg-cream px-5 py-4 text-ink outline-none focus:ring-4 focus:ring-coral/30"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {filteredLocations.length === 0 ? (
          <div className="rounded-2xl border border-turquoise/15 bg-cream p-10 text-center">
            <p className="text-4xl">🔎</p>
            <h2 className="mt-4 text-xl font-bold text-ink">No locations found</h2>
            <p className="mt-2 text-ink/60">Try a different coastal location.</p>
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