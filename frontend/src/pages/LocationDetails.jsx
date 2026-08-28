import { useEffect, useState } from "react";
import { Link, useParams, useLocation as useRouterLocation } from "react-router-dom";
import MarineConditions from "../components/MarineConditions";
import SafetyIndicator from "../components/SafetyIndicator";
import WeatherCard from "../components/WeatherCard";
import Forecast from "../components/Forecast";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import ReportForm from "../components/ReportForm";
import LocationBusinesses from "../components/LocationBusinesses";
import { coastalLocations } from "../data/coastalLocations";
import { fetchWeather } from "../services/weatherApi";
import { fetchMarine } from "../services/marineApi";
import { formatWeather } from "../utils/formatWeather";
import { formatMarineData } from "../utils/formatMarineData";
import { resolveBackendLocationId } from "../services/locationsApi";
import { listReports } from "../services/reportsApi";

function LocationDetails() {
  const { id } = useParams();
  const routerLocation = useRouterLocation();
  const searchedLocation = routerLocation.state?.location;

  const location =
    searchedLocation ??
    coastalLocations.find((item) => item.id.toLowerCase() === id?.toLowerCase());

  const [weather, setWeather] = useState(null);
  const [marine, setMarine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [backendLocationId, setBackendLocationId] = useState(null);
  const [reports, setReports] = useState([]);
  const [reportsLoading, setReportsLoading] = useState(false);

  useEffect(() => {
    if (!location) {
      setLoading(false);
      return;
    }

    let isCancelled = false;

    async function loadConditions() {
      setLoading(true);
      setError(null);

      try {
        const [weatherResult, marineResult] = await Promise.allSettled([
          fetchWeather(location.latitude, location.longitude),
          fetchMarine(location.latitude, location.longitude),
        ]);

        if (isCancelled) return;

        if (weatherResult.status === "fulfilled") {
          setWeather(formatWeather(weatherResult.value));
        } else {
          throw weatherResult.reason;
        }

        setMarine(marineResult.status === "fulfilled" ? formatMarineData(marineResult.value) : null);
      } catch (err) {
        if (!isCancelled) setError(err);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }

    loadConditions();
    return () => { isCancelled = true; };
  }, [location]);

  async function loadReports(backendId) {
    setReportsLoading(true);
    try {
      const data = await listReports({ locationId: backendId, page: 1, perPage: 5 });
      setReports(data.items);
    } catch {
      setReports([]);
    } finally {
      setReportsLoading(false);
    }
  }

  useEffect(() => {
    if (!location) return;
    let isCancelled = false;

    resolveBackendLocationId(location).then((backendId) => {
      if (isCancelled) return;
      setBackendLocationId(backendId);
      if (backendId) loadReports(backendId);
    });

    return () => { isCancelled = true; };
  }, [location]);

  if (!location) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-5xl">🌊</p>
          <h1 className="mt-4 text-3xl font-bold text-slate-900">Location not found</h1>
          <p className="mt-3 text-slate-500">We could not find the coastal location you're looking for.</p>
          <Link to="/explore" className="mt-6 inline-flex rounded-xl bg-slate-950 px-6 py-3 font-semibold text-white">
            Explore Locations
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <Link to="/explore" className="text-sm font-medium text-cyan-300 hover:text-cyan-200">
            ← Back to Explore
          </Link>
          <div className="mt-8 max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-cyan-300">
              {location.region}, {location.country}
            </p>
            <h1 className="mt-2 text-4xl font-black sm:text-5xl">{location.name}</h1>
            <p className="mt-5 text-lg leading-8 text-slate-300">{location.description}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
        {loading && <LoadingSpinner />}

        {!loading && error && (
          <ErrorMessage message="We couldn't load live conditions for this location. Please try again shortly." />
        )}

        {!loading && !error && weather && (
          <>
            <SafetyIndicator weather={weather.current} marine={marine?.current ?? null} />
            <WeatherCard current={weather.current} units={weather.units} />
            {marine ? (
              <MarineConditions current={marine.current} units={marine.units} />
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
                Marine conditions aren't available for this location right now.
              </div>
            )}
            {weather.hourly && <Forecast hourly={weather.hourly} units={weather.units} />}
          </>
        )}

        {/* Verified business/facility listings — approved only. */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-bold text-slate-900">Verified Facilities</h2>
          <div className="mt-4">
            <LocationBusinesses backendLocationId={backendLocationId} />
          </div>
        </div>

        {/* Community safety reports — only available once this location
            has a matching backend record. */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-bold text-slate-900">Community Safety Reports</h2>

          {backendLocationId === null && !reportsLoading && (
            <p className="mt-2 text-sm text-slate-500">
              Community reporting isn't available for this location yet.
            </p>
          )}

          {backendLocationId !== null && (
            <>
              <div className="mt-4 space-y-3">
                {reportsLoading && <LoadingSpinner />}
                {!reportsLoading && reports.length === 0 && (
                  <p className="text-sm text-slate-500">No reports yet — be the first.</p>
                )}
                {!reportsLoading &&
                  reports.map((r) => (
                    <div key={r.id} className="rounded-lg border border-slate-100 bg-slate-50 p-3 text-sm">
                      <span className="font-semibold capitalize text-slate-900">{r.rating}</span>
                      {r.notes && <span className="text-slate-600"> — {r.notes}</span>}
                      <div className="mt-1 text-xs text-slate-400">
                        {new Date(r.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
              </div>

              <div className="mt-5">
                <ReportForm
                  backendLocationId={backendLocationId}
                  onSubmitted={() => loadReports(backendLocationId)}
                />
              </div>
            </>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm leading-6 text-slate-500">
          CoastSafe uses modeled weather and marine information for general planning and awareness.
          Always follow official local guidance and conditions on site.
        </div>
      </section>
    </main>
  );
}

export default LocationDetails;
