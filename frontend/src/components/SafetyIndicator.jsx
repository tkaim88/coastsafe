function SafetyIndicator({ weather, marine }) {
  if (!weather || !marine) {
    return null;
  }

  const waveHeight = marine.wave_height ?? 0;
  const windSpeed = weather.wind_speed_10m ?? 0;
  const precipitation = weather.precipitation ?? 0;

  let status = "Favorable";
  let description =
    "Current modeled conditions appear relatively calm based on the available data.";

  if (waveHeight >= 2 || windSpeed >= 35) {
    status = "Caution";
    description =
      "Current modeled conditions include stronger marine or wind conditions. Exercise additional caution.";
  } else if (waveHeight >= 1.5 || windSpeed >= 25 || precipitation >= 5) {
    status = "Moderate";
    description =
      "Some conditions may require additional planning depending on the activity.";
  }

  const styles = {
    Favorable: "border-emerald-200 bg-emerald-50 text-emerald-900",
    Moderate: "border-amber-200 bg-amber-50 text-amber-900",
    Caution: "border-orange-200 bg-orange-50 text-orange-900",
  };

  return (
    <section
      className={`rounded-2xl border p-6 ${
        styles[status] ?? "border-slate-200 bg-white text-slate-900"
      }`}
    >
      <p className="text-sm font-semibold uppercase tracking-wider">
        Conditions Summary
      </p>

      <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="text-3xl font-bold">{status}</h2>
        <span className="text-2xl">🌊</span>
      </div>

      <p className="mt-3 max-w-3xl text-sm leading-6">{description}</p>

      <p className="mt-4 text-xs opacity-70">
        This summary is informational only and does not represent an official
        safety assessment.
      </p>
    </section>
  );
}

export default SafetyIndicator;