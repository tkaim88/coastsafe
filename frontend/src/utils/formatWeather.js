/**
 * Transforms a raw Open-Meteo weather response into the shape
 * WeatherCard / Forecast / SafetyIndicator expect.
 */
export function formatWeather(raw) {
  if (!raw?.current) {
    return null;
  }

  const current = {
    temperature_2m: raw.current.temperature_2m,
    apparent_temperature: raw.current.apparent_temperature,
    relative_humidity_2m: raw.current.relative_humidity_2m,
    precipitation: raw.current.precipitation,
    weather_code: raw.current.weather_code,
    wind_speed_10m: raw.current.wind_speed_10m,
    wind_direction_10m: raw.current.wind_direction_10m,
  };

  const hourly = raw.hourly
    ? {
        time: raw.hourly.time,
        temperature_2m: raw.hourly.temperature_2m,
        precipitation_probability: raw.hourly.precipitation_probability,
        weather_code: raw.hourly.weather_code,
      }
    : null;

  const units = {
    temperature_2m: `°${raw.current_units?.temperature_2m ?? "C"}`.replace("°°", "°"),
    apparent_temperature: `°${raw.current_units?.apparent_temperature ?? "C"}`.replace("°°", "°"),
    relative_humidity_2m: raw.current_units?.relative_humidity_2m ?? "%",
    wind_speed_10m: ` ${raw.current_units?.wind_speed_10m ?? "km/h"}`,
  };

  return { current, hourly, units };
}