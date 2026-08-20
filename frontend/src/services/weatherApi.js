const WEATHER_BASE_URL = "https://api.open-meteo.com/v1/forecast";

/**
 * Fetches current + hourly weather data for a given coordinate pair.
 * @param {number} latitude
 * @param {number} longitude
 * @returns {Promise<object>} raw Open-Meteo weather response
 */
export async function fetchWeather(latitude, longitude) {
  const params = new URLSearchParams({
    latitude,
    longitude,
    current: [
      "temperature_2m",
      "apparent_temperature",
      "relative_humidity_2m",
      "precipitation",
      "weather_code",
      "wind_speed_10m",
      "wind_direction_10m",
    ].join(","),
    hourly: [
      "temperature_2m",
      "precipitation_probability",
      "weather_code",
    ].join(","),
    forecast_days: 2,
    timezone: "auto",
  });

  const response = await fetch(`${WEATHER_BASE_URL}?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`Weather API request failed with status ${response.status}`);
  }

  return response.json();
}