import { Link } from "react-router-dom";

function LocationCard({ location }) {
  return (
    <Link
      to={`/location/${location.id}`}
      className="group block rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-cyan-300 hover:shadow-xl"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-600">
            {location.region}
          </p>

          <h3 className="mt-2 text-xl font-bold text-slate-900">
            {location.name}
          </h3>
        </div>

        <span className="text-2xl transition group-hover:translate-x-1">
          →
        </span>
      </div>

      <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">
        {location.description}
      </p>

      <div className="mt-6 flex items-center justify-between text-sm">
        <span className="text-slate-500">{location.country}</span>

        <span className="font-semibold text-cyan-700">
          View conditions
        </span>
      </div>
    </Link>
  );
}

export default LocationCard;