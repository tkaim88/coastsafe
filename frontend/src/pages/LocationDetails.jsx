import { useEffect, useState } from "react";
import {
  Link,
  useParams,
  useLocation as useRouterLocation,
} from "react-router-dom";
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
import { deleteReport } from "../services/reportsApi";
import { useAuth } from "../context/AuthContext";

function LocationDetails() {
  const { id } = useParams();
  const routerLocation = useRouterLocation();
  const searchedLocation = routerLocation.state?.location;

  const location =
    searchedLocation ??
    coastalLocations.find(
      (item) => item.id.toLowerCase() === id?.toLowerCase(),
    );

  const FALLBACK_PHOTO =
    "https://images.pexels.com/photos/9401017/pexels-photo-9401017.jpeg?auto=compress&cs=tinysrgb&w=1600";

  const [weather, setWeather] = useState(null);
  const [marine, setMarine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [backendLocationId, setBackendLocationId] = useState(null);
  const [reports, setReports] = useState([]);
  const [reportsLoading, setReportsLoading] = useState(false);

  const { user, accessToken } = useAuth(); // add this import from "../context/AuthContext" if not already present
  const [editingReportId, setEditingReportId] = useState(null);

  async function handleDeleteReport(reportId) {
    if (!window.confirm("Delete this report? This can't be undone.")) return;
    try {
      await deleteReport(accessToken, reportId);
      loadReports(backendLocationId);
    } catch (err) {
      console.error("Failed to delete report:", err);
    }
  }

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

        setMarine(
          marineResult.status === "fulfilled"
            ? formatMarineData(marineResult.value)
            : null,
        );
      } catch (err) {
        if (!isCancelled) setError(err);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }

    loadConditions();
    return () => {
      isCancelled = true;
    };
  }, [location]);

  async function loadReports(backendId) {
    setReportsLoading(true);
    try {
      const data = await listReports({
        locationId: backendId,
        page: 1,
        perPage: 5,
      });
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

    return () => {
      isCancelled = true;
    };
  }, [location]);

  if (!location) {
    return (
      <main className="min-h-screen bg-lagoon px-4 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-5xl">🌊</p>
          <h1 className="mt-4 text-3xl font-bold text-ink">
            Location not found
          </h1>
          <p className="mt-3 text-ink/60">
            We could not find the coastal location you're looking for.
          </p>
          <Link
            to="/explore"
            className="mt-6 inline-flex rounded-xl bg-turquoise px-6 py-3 font-semibold text-white"
          >
            Explore Locations
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-lagoon">
      {/* Hero — same photo shown on this location's card on Home/Explore,
          so the tile you clicked visually carries through to this page. */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={location.photo || FALLBACK_PHOTO}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-turquoise/80 via-turquoise/70 to-lagoon" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <Link
            to="/explore"
            className="text-sm font-medium text-cream hover:text-white"
          >
            ← Back to Explore
          </Link>
          <div className="mt-8 max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-cream/90">
              {location.region}, {location.country}
            </p>
            <h1 className="mt-2 font-display text-4xl font-medium text-white sm:text-5xl">
              {location.name}
            </h1>
            <p className="mt-5 text-lg leading-8 text-white/85">
              {location.description}
            </p>
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
            <SafetyIndicator
              weather={weather.current}
              marine={marine?.current ?? null}
            />
            <WeatherCard current={weather.current} units={weather.units} />
            {marine ? (
              <MarineConditions current={marine.current} units={marine.units} />
            ) : (
              <div className="rounded-2xl border border-turquoise/15 bg-cream p-6 text-sm text-ink/60">
                Marine conditions aren't available for this location right now.
              </div>
            )}
            {weather.hourly && (
              <Forecast hourly={weather.hourly} units={weather.units} />
            )}
          </>
        )}

        {/* Verified business/facility listings — approved only. */}
        <div className="rounded-2xl border border-turquoise/15 bg-cream p-6">
          <h2 className="text-lg font-bold text-ink">Verified Facilities</h2>
          <div className="mt-4">
            <LocationBusinesses backendLocationId={backendLocationId} />
          </div>
        </div>

        {/* Community safety reports — only available once this location
            has a matching backend record. */}

        <div className="rounded-2xl border border-turquoise/15 bg-cream p-6">
          <h2 className="text-lg font-bold text-ink">
            Community Safety Reports
          </h2>

          {backendLocationId === null && !reportsLoading && (
            <p className="mt-2 text-sm text-ink/60">
              Community reporting isn't available for this location yet.
            </p>
          )}
          {backendLocationId !== null && (
            <>
              <div className="mt-4 space-y-3">
                {reportsLoading && <LoadingSpinner />}
                {!reportsLoading && reports.length === 0 && (
                  <p className="text-sm text-ink/60">
                    No reports yet — be the first.
                  </p>
                )}
                {!reportsLoading &&
                  reports.map((r) => (
                    <div
                      key={r.id}
                      className="rounded-lg border border-turquoise/10 bg-lagoon p-3 text-sm"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="font-semibold capitalize text-ink">
                            {r.rating}
                          </span>
                          {r.notes && (
                            <span className="text-ink/70"> — {r.notes}</span>
                          )}
                          <div className="mt-1 text-xs text-ink/40">
                            {new Date(r.created_at).toLocaleDateString()}
                          </div>
                        </div>

                        {/* Only the report's own author sees edit/delete controls —
                    the backend enforces this too via owns_resource, this
                    is just so non-owners aren't shown buttons that would
                    403 if clicked. */}
                        {user?.id === r.user_id && (
                          <div className="flex shrink-0 gap-2">
                            <button
                              type="button"
                              onClick={() => setEditingReportId(r.id)}
                              className="text-xs font-semibold text-deep hover:text-ink"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteReport(r.id)}
                              className="text-xs font-semibold text-coral hover:text-coral/80"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>

              <div className="mt-5">
                <ReportForm
                  key={editingReportId ?? "new"}
                  backendLocationId={backendLocationId}
                  editingReport={reports.find((r) => r.id === editingReportId)}
                  onCancelEdit={() => setEditingReportId(null)}
                  onSubmitted={() => {
                    setEditingReportId(null);
                    loadReports(backendLocationId);
                  }}
                />
              </div>
            </>
          )}
        </div>

        <div className="rounded-2xl border border-turquoise/15 bg-cream p-6 text-sm leading-6 text-ink/60">
          CoastSafe uses modeled weather and marine information for general
          planning and awareness. Always follow official local guidance and
          conditions on site.
        </div>
      </section>
    </main>
  );
}

export default LocationDetails;
