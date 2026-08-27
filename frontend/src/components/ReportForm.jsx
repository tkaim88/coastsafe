import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { createReport } from "../services/reportsApi";

const RATINGS = [
  { value: "favorable", label: "Favorable" },
  { value: "caution", label: "Use caution" },
  { value: "unsafe", label: "Unsafe" },
];

/**
 * @param {number} backendLocationId - resolved numeric Location ID (see
 *   services/locationsApi.js) — never the frontend slug/search-result id.
 * @param {() => void} onSubmitted - called after a successful submit so
 *   the parent can refetch the report list.
 */
function ReportForm({ backendLocationId, onSubmitted }) {
  const { isAuthenticated, accessToken } = useAuth();
  const [rating, setRating] = useState("favorable");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
        <Link to="/login" className="font-medium text-cyan-700 hover:text-cyan-800">
          Log in
        </Link>{" "}
        to submit a safety report for this location.
      </div>
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await createReport(accessToken, { rating, notes, locationId: backendLocationId });
      setNotes("");
      setRating("favorable");
      onSubmitted?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white p-5">
      <h3 className="font-semibold text-slate-900">Submit a safety report</h3>

      <div className="mt-3">
        <label htmlFor="rating" className="block text-sm font-medium text-slate-700">
          Conditions
        </label>
        <select
          id="rating"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/20"
        >
          {RATINGS.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-3">
        <label htmlFor="notes" className="block text-sm font-medium text-slate-700">
          Notes (optional)
        </label>
        <textarea
          id="notes"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="What did you observe?"
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/20"
        />
      </div>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="mt-4 rounded-lg bg-cyan-500 px-4 py-2 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-50"
      >
        {submitting ? "Submitting..." : "Submit report"}
      </button>
    </form>
  );
}

export default ReportForm;
