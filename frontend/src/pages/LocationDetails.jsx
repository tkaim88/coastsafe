import { useEffect, useState } from "react";
import { Link, useParams, useLocation as useRouterLocation } from "react-router-dom";
import MarineConditions from "../components/MarineConditions";
import SafetyIndicator from "../components/SafetyIndicator";
import WeatherCard from "../components/WeatherCard";
import Forecast from "../components/Forecast";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import { coastalLocations } from "../data/coastalLocations";
import { fetchWeather } from "../services/weatherApi";
import { fetchMarine } from "../services/marineApi";
import { formatWeather } from "../utils/formatWeather";
import { formatMarineData } from "../utils/formatMarineData";

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
        // Fetch weather and marine in parallel — a marine failure
        // shouldn't block weather from displaying, and vice versa.
        const [weatherResult, marineResult] = await Promise.allSettled([
          fetchWeather(location.latitude, location.longitude),
          fetchMarine(location.latitude, location.longitude),
        ]);

        if (isCancelled) return;

        if (weatherResult.status === "fulfilled") {
          setWeather(formatWeather(weatherResult.value));
        } else {
          // Weather failing is the one we treat as a hard error —
          // it's core to the page.
          throw weatherResult.reason;
        }

        if (marineResult.status === "fulfilled") {
          setMarine(formatMarineData(marineResult.value));
        } else {
          // Marine failing is non-fatal — just show as unavailable.
          setMarine(null);
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    loadConditions();

    return () => {
      isCancelled = true;
    };
  }, [location]);

  if (!location) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-5xl">🌊</p>
          <h1 className="mt-4 text-3xl font-bold text-slate-900">
            Location not found
          </h1>
          <p className="mt-3 text-slate-500">
            We could not find the coastal location you're looking for.
          </p>

          <Link
            to="/explore"
            className="mt-6 inline-flex rounded-xl bg-slate-950 px-6 py-3 font-semibold text-white"
          >
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
          <Link
            to="/explore"
            className="text-sm font-medium text-cyan-300 hover:text-cyan-200"
          >
            ← Back to Explore
          </Link>

          <div className="mt-8 max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-cyan-300">
              {location.region}, {location.country}
            </p>

            <h1 className="mt-2 text-4xl font-black sm:text-5xl">
              {location.name}
            </h1>

            <p className="mt-5 text-lg leading-8 text-slate-300">
              {location.description}
            </p>

            <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-400">
              <span>Latitude: {location.latitude.toFixed(4)}</span>
              <span>•</span>
              <span>Longitude: {location.longitude.toFixed(4)}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
        {loading && <LoadingSpinner />}

        {!loading && error && (
          <ErrorMessage
            message="We couldn't load live conditions for this location. Please try again shortly."
          />
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

            {weather.hourly && (
              <Forecast hourly={weather.hourly} units={weather.units} />
            )}
          </>
        )}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm leading-6 text-slate-500">
          CoastSafe uses modeled weather and marine information for general
          planning and awareness. Always follow official local guidance and
          conditions on site.
        </div>
      </section>
    </main>
  );
}

export default LocationDetails;