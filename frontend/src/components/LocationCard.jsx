import { Link } from "react-router-dom";

function LocationCard({ location }) {
  return (
    <Link
      to={`/location/${location.id}`}
      className="group block overflow-hidden rounded-2xl border border-turquoise/15 bg-cream shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl"
    >
      {/* Fixed-ratio, clipped container — every photo, regardless of its
          native pixel dimensions, is cropped to fill this box and never
          spills past the tile. Reuse this exact pattern anywhere else in
          the app that shows a photo inside a card. */}
      <div className="aspect-[4/3] w-full overflow-hidden bg-turquoise/10">
        <img
          src={location.photo}
          alt={location.name}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-deep">
              {location.region}
            </p>
            <h3 className="mt-2 text-xl font-bold text-ink">
              {location.name}
            </h3>
          </div>
          <span className="text-2xl text-deep transition group-hover:translate-x-1">
            →
          </span>
        </div>

        <p className="mt-4 line-clamp-3 text-sm leading-6 text-ink/70">
          {location.description}
        </p>

        <div className="mt-6 flex items-center justify-between text-sm">
          <span className="text-ink/50">{location.country}</span>
          <span className="font-semibold text-deep">View conditions</span>
        </div>
      </div>
    </Link>
  );
}

export default LocationCard;