import { Link, useParams } from "react-router-dom";
import MarineConditions from "../components/MarineConditions";
import SafetyIndicator from "../components/SafetyIndicator";
import WeatherCard from "../components/WeatherCard";
import Forecast from "../components/Forecast";
import { coastalLocations } from "../data/coastalLocations";

const demoWeather = {
  temperature_2m: 27,
  apparent_temperature: 29,
  relative_humidity_2m: 76,
  precipitation: 0,
  weather_code: 1,
  wind_speed_10m: 18,
  wind_direction_10m: 110,
};

const demoMarine = {
  wave_height: 1.2,
  wave_direction: 90,
  wave_period: 8,
  sea_surface_temperature: 26,
  sea_level_height_msl: 0.4,
};

const demoHourly = {
  time: Array.from({ length: 12 }, (_, index) => {
    const date = new Date();
    date.setHours(date.getHours() + index, 0, 0, 0);
    return date.toISOString();
  }),
  temperature_2m: [27, 27, 27, 28, 28, 28, 29, 29, 29, 28, 28, 27],
  precipitation_probability: [5, 5, 5, 10, 10, 10, 15, 15, 10, 10, 5, 5],
  weather_code: [1, 1, 2, 2, 2, 3, 3, 3, 2, 2, 1, 1],
};

const weatherUnits = {
  temperature_2m: "°C",
  apparent_temperature: "°C",
  relative_humidity_2m: "%",
  wind_speed_10m: " km/h",
};

const marineUnits = {
  wave_height: " m",
  wave_direction: "°",
  wave_period: " s",
  sea_surface_temperature: "°C",
};

function LocationDetails() {
  const { id } = useParams();

  const location = coastalLocations.find(
    (item) => item.id.toLowerCase() === id?.toLowerCase(),
  );

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
              <span>
                Latitude: {location.latitude.toFixed(4)}
              </span>
              <span>•</span>
              <span>
                Longitude: {location.longitude.toFixed(4)}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
        <SafetyIndicator
          weather={demoWeather}
          marine={demoMarine}
        />

        <WeatherCard
          current={demoWeather}
          units={weatherUnits}
        />

        <MarineConditions
          current={demoMarine}
          units={marineUnits}
        />

        <Forecast
          hourly={demoHourly}
          units={weatherUnits}
        />

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