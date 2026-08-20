import { getWeatherIcon, getWeatherInfo } from "../utils/weatherCodes";

function WeatherCard({ current, units }) {
  if (!current) {
    return null;
  }

  const weather = getWeatherInfo(current.weather_code);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
            Current Weather
          </p>

          <h2 className="mt-1 text-xl font-bold text-slate-900">
            Atmospheric Conditions
          </h2>
        </div>

        <div className="text-4xl">{getWeatherIcon(current.weather_code)}</div>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-sm text-slate-500">Temperature</p>
          <p className="mt-1 text-3xl font-bold text-slate-900">
            {current.temperature_2m}
            {units?.temperature_2m}
          </p>
          <p className="mt-1 text-sm text-slate-500">{weather.label}</p>
        </div>

        <div>
          <p className="text-sm text-slate-500">Feels Like</p>
          <p className="mt-1 text-3xl font-bold text-slate-900">
            {current.apparent_temperature}
            {units?.apparent_temperature}
          </p>
        </div>

        <div>
          <p className="text-sm text-slate-500">Wind</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {current.wind_speed_10m}
            {units?.wind_speed_10m}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Direction: {current.wind_direction_10m}°
          </p>
        </div>

        <div>
          <p className="text-sm text-slate-500">Humidity</p>
          <p className="mt-1 text-3xl font-bold text-slate-900">
            {current.relative_humidity_2m}
            {units?.relative_humidity_2m}
          </p>
        </div>
      </div>
    </section>
  );
}

export default WeatherCard;