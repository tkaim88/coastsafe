import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import { searchLocations } from "../services/geocodingApi";
import { formatGeocodingResult } from "../utils/formatGeocodingResult";

function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const navigate = useNavigate();

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query) {
      setLoading(false);
      return;
    }

    let isCancelled = false;

    async function runSearch() {
      setLoading(true);
      setError(null);

      try {
        const raw = await searchLocations(query);
        if (!isCancelled) {
          setResults(raw.map(formatGeocodingResult));
        }
      } catch (err) {
        if (!isCancelled) setError(err);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }

    runSearch();

    return () => {
      isCancelled = true;
    };
  }, [query]);

  function handleSelect(location) {
    // Pass the resolved location via router state so LocationDetails
    // doesn't need to re-geocode or look it up in the static list.
    navigate(`/location/${location.id}`, { state: { location } });
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-slate-900">
          Results for "{query}"
        </h1>

        {loading && <LoadingSpinner />}

        {!loading && error && (
          <ErrorMessage message="We couldn't search right now. Please try again." />
        )}

        {!loading && !error && results.length === 0 && (
          <p className="mt-4 text-slate-500">
            No coastal locations found for that search.
          </p>
        )}

        <div className="mt-6 space-y-3">
          {results.map((location) => (
            <button
              key={location.id}
              onClick={() => handleSelect(location)}
              className="w-full rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-cyan-400"
            >
              <p className="font-semibold text-slate-900">{location.name}</p>
              <p className="text-sm text-slate-500">{location.description}</p>
            </button>
          ))}
        </div>

        <Link to="/" className="mt-8 inline-block text-sm text-cyan-700">
          ← Back home
        </Link>
      </div>
    </main>
  );
}

export default SearchResults;