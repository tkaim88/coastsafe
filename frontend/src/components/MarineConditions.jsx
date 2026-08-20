function MarineConditions({ current, units }) {
  if (!current) {
    return null;
  }

  const items = [
    {
      label: "Wave Height",
      value: current.wave_height,
      unit: units?.wave_height,
      icon: "🌊",
    },
    {
      label: "Wave Period",
      value: current.wave_period,
      unit: units?.wave_period,
      icon: "⏱️",
    },
    {
      label: "Wave Direction",
      value: current.wave_direction,
      unit: units?.wave_direction,
      icon: "🧭",
    },
    {
      label: "Sea Temperature",
      value: current.sea_surface_temperature,
      unit: units?.sea_surface_temperature,
      icon: "🌡️",
    },
  ];

  return (
    <section className="rounded-2xl bg-slate-950 p-6 text-white shadow-sm">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-cyan-300">
          Marine Conditions
        </p>

        <h2 className="mt-1 text-xl font-bold">
          Current Sea Conditions
        </h2>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-white/10 bg-white/5 p-5"
          >
            <div className="text-2xl">{item.icon}</div>

            <p className="mt-4 text-sm text-slate-400">{item.label}</p>

            <p className="mt-1 text-2xl font-bold">
              {item.value}
              {item.unit}
            </p>
          </div>
        ))}
      </div>

      {current.sea_level_height_msl != null && (
        <p className="mt-6 text-xs leading-5 text-slate-400">
          Sea-level information is model-based and is shown for general
          planning and awareness.
        </p>
      )}
    </section>
  );
}

export default MarineConditions;