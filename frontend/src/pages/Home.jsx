import { Link } from "react-router-dom";
import LocationCard from "../components/LocationCard";
import { coastalLocations } from "../data/coastalLocations";

function Home() {
  return (
    <main>
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.12),transparent_35%)]" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-300">
              Coastal conditions, simplified.
            </span>

            <h1 className="mt-6 text-5xl font-black tracking-tight sm:text-6xl">
              Know before
              <span className="block text-cyan-400">you go.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Explore weather and marine conditions for coastal destinations
              with a simple, focused interface built for everyday planning.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/explore"
                className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400"
              >
                Explore Locations
              </Link>

              <Link
                to="/about"
                className="rounded-xl border border-white/20 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                About CoastSafe
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-cyan-600">
              Featured
            </p>
            <h2 className="mt-1 text-3xl font-bold text-slate-900">
              Explore Kenya's Coast
            </h2>
          </div>

          <Link
            to="/explore"
            className="text-sm font-semibold text-cyan-700 hover:text-cyan-800"
          >
            View all →
          </Link>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {coastalLocations.slice(0, 6).map((location) => (
            <LocationCard key={location.id} location={location} />
          ))}
        </div>
      </section>
    </main>
  );
}

export default Home;