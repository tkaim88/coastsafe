import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LocationCard from "../components/LocationCard";
import { coastalLocations } from "../data/coastalLocations";

const HERO_PHOTOS = [
  "https://images.pexels.com/photos/9401017/pexels-photo-9401017.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "https://images.pexels.com/photos/4321802/pexels-photo-4321802.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "https://images.pexels.com/photos/12858513/pexels-photo-12858513.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "https://images.pexels.com/photos/11670749/pexels-photo-11670749.jpeg?auto=compress&cs=tinysrgb&w=1600",
];

function Home() {
  const [photoIndex, setPhotoIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setPhotoIndex((i) => (i + 1) % HERO_PHOTOS.length);
    }, 7000);
    return () => clearInterval(id);
  }, []);

  return (
    <main className="bg-lagoon">
      <section className="relative isolate overflow-hidden bg-gradient-to-b from-turquoise to-lagoon">
        <div className="absolute inset-0">
          {HERO_PHOTOS.map((src, i) => (
            <img
              key={src}
              src={src}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover transition-opacity duration-[2000ms] ease-in-out"
              style={{ opacity: i === photoIndex ? 0.55 : 0 }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-turquoise/60 via-turquoise/40 to-lagoon" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="drift max-w-2xl rounded-[2rem] border border-white/40 bg-cream/90 p-8 shadow-xl backdrop-blur-sm sm:p-10">
            <span className="inline-flex rounded-full bg-cream px-4 py-1.5 text-xs font-medium uppercase tracking-wide text-ink">
             Know your destination
             </span>

            <h1 className="mt-6 font-display text-5xl font-medium leading-[1.05] text-ink sm:text-6xl">
              Know before
              <span className="block text-coral">you go.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-ink/70">
              Live weather and marine conditions for Kenya's coast — plus
              verified facilities and lifeguard availability, drawn from the
              community that knows these waters best.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                to="/explore"
                className="rounded-full bg-coral px-6 py-3 font-semibold text-white transition hover:bg-coral/90"
              >
                Explore Locations
              </Link>
              <Link
                to="/about"
                className="rounded-full border border-ink/20 px-6 py-3 font-semibold text-ink transition hover:bg-white/40"
              >
                About CoastSafe
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-deep">
              Featured
            </p>
            <h2 className="mt-1 font-display text-3xl font-medium text-ink">
              Explore Kenya's Coast
            </h2>
          </div>
          <Link
            to="/explore"
            className="text-sm font-semibold text-deep hover:text-ink"
          >
            View all
          </Link>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {coastalLocations.slice(0, 6).map((location) => (
            <LocationCard key={location.id} location={location} />
          ))}
        </div>
      </section>
    </main>
  );
}

export default Home;
