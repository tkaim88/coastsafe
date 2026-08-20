import { getWeatherIcon, getWeatherInfo } from "../utils/weatherCodes";

function Forecast({ hourly, units }) {
  if (!hourly?.time?.length) {
    return null;
  }

  const items = hourly.time.slice(0, 12).map((time, index) => ({
    time,
    temperature: hourly.temperature_2m?.[index],
    precipitation: hourly.precipitation_probability?.[index],
    weatherCode: hourly.weather_code?.[index],
  }));

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-cyan-600">
          Forecast
        </p>

        <h2 className="mt-1 text-xl font-bold text-slate-900">
          Next Several Hours
        </h2>
      </div>

      <div className="mt-6 flex gap-4 overflow-x-auto pb-2">
        {items.map((item) => {
          const date = new Date(item.time);

          return (
            <div
              key={item.time}
              className="min-w-28 rounded-xl border border-slate-200 bg-slate-50 p-4 text-center"
            >
              <p className="text-xs font-semibold text-slate-500">
                {date.toLocaleTimeString([], {
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </p>

              <div className="mt-3 text-2xl">
                {getWeatherIcon(item.weatherCode)}
              </div>

              <p className="mt-3 text-lg font-bold text-slate-900">
                {item.temperature}
                {units?.temperature_2m}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {item.precipitation ?? 0}% rain
              </p>

              <p className="mt-2 text-[11px] text-slate-500">
                {getWeatherInfo(item.weatherCode).label}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default Forecast;