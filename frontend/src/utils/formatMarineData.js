/**
 * Transforms a raw Open-Meteo marine response into the shape
 * MarineConditions / SafetyIndicator expect.
 * Returns null if marine data isn't available for this coordinate
 * (common outside well-covered coastal/ocean regions).
 */
export function formatMarineData(raw) {
  if (!raw?.current) {
    return null;
  }

  const { wave_height, wave_direction, wave_period, sea_surface_temperature, sea_level_height_msl } =
    raw.current;

  const hasData = [wave_height, wave_direction, wave_period].some(
    (value) => value !== null && value !== undefined,
  );

  if (!hasData) {
    return null;
  }

  const current = {
    wave_height,
    wave_direction,
    wave_period,
    sea_surface_temperature,
    sea_level_height_msl,
  };

  const units = {
    wave_height: ` ${raw.current_units?.wave_height ?? "m"}`,
    wave_direction: raw.current_units?.wave_direction ?? "°",
    wave_period: ` ${raw.current_units?.wave_period ?? "s"}`,
    sea_surface_temperature: `°${raw.current_units?.sea_surface_temperature ?? "C"}`.replace("°°", "°"),
  };

  return { current, units };
}