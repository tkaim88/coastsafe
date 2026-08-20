const WEATHER_CODES = {
  0: {
    label: "Clear sky",
    icon: "☀️",
  },
  1: {
    label: "Mainly clear",
    icon: "🌤️",
  },
  2: {
    label: "Partly cloudy",
    icon: "⛅",
  },
  3: {
    label: "Overcast",
    icon: "☁️",
  },
  45: {
    label: "Fog",
    icon: "🌫️",
  },
  48: {
    label: "Depositing rime fog",
    icon: "🌫️",
  },
  51: {
    label: "Light drizzle",
    icon: "🌦️",
  },
  53: {
    label: "Moderate drizzle",
    icon: "🌦️",
  },
  55: {
    label: "Dense drizzle",
    icon: "🌧️",
  },
  61: {
    label: "Slight rain",
    icon: "🌦️",
  },
  63: {
    label: "Moderate rain",
    icon: "🌧️",
  },
  65: {
    label: "Heavy rain",
    icon: "🌧️",
  },
  80: {
    label: "Slight rain showers",
    icon: "🌦️",
  },
  81: {
    label: "Moderate rain showers",
    icon: "🌧️",
  },
  82: {
    label: "Violent rain showers",
    icon: "⛈️",
  },
  95: {
    label: "Thunderstorm",
    icon: "⛈️",
  },
  96: {
    label: "Thunderstorm with slight hail",
    icon: "⛈️",
  },
  99: {
    label: "Thunderstorm with heavy hail",
    icon: "⛈️",
  },
};

export function getWeatherInfo(code) {
  return (
    WEATHER_CODES[code] ?? {
      label: "Unknown conditions",
      icon: "🌊",
    }
  );
}

export function formatWeatherCode(code) {
  return getWeatherInfo(code).label;
}

export function getWeatherIcon(code) {
  return getWeatherInfo(code).icon;
}