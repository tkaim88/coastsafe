import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { createReport, updateReport } from "../services/reportsApi";

const RATINGS = [
  { value: "favorable", label: "Favorable" },
  { value: "caution", label: "Use caution" },
  { value: "unsafe", label: "Unsafe" },
];

/**
 * @param {number} backendLocationId - resolved numeric Location ID, used
 *   when creating a new report. Ignored in edit mode.
 * @param {() => void} onSubmitted - called after a successful create or
 *   update so the parent can refetch the report list.
 * @param {object} [editingReport] - if provided, the form switches to
 *   edit mode, pre-fills from this report, and calls updateReport on
 *   submit instead of createReport. Pass `key={editingReport?.id ?? "new"}`
 *   on the parent's usage of this component so its internal state resets
 *   cleanly when switching between create/edit or between two reports.
 * @param {() => void} [onCancelEdit] - called when the user cancels out
 *   of edit mode. Only relevant when editingReport is provided.
 */
function ReportForm({ backendLocationId, onSubmitted, editingReport, onCancelEdit }) {
  const { isAuthenticated, accessToken } = useAuth();
  const isEditing = Boolean(editingReport);

  const [rating, setRating] = useState(editingReport?.rating ?? "favorable");
  const [notes, setNotes] = useState(editingReport?.notes ?? "");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="rounded-xl border border-turquoise/15 bg-cream p-5 text-sm text-ink/70">
        <Link to="/login" className="font-medium text-deep hover:text-ink">
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
      if (isEditing) {
        await updateReport(accessToken, editingReport.id, { rating, notes });
      } else {
        await createReport(accessToken, { rating, notes, locationId: backendLocationId });
        setNotes("");
        setRating("favorable");
      }
      onSubmitted?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-turquoise/15 bg-cream p-5">
      <h3 className="font-semibold text-ink">
        {isEditing ? "Edit your safety report" : "Submit a safety report"}
      </h3>

      <div className="mt-3">
        <label htmlFor="rating" className="block text-sm font-medium text-ink/80">
          Conditions
        </label>
        <select
          id="rating"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="mt-1 w-full rounded-lg border border-turquoise/25 px-3 py-2 text-ink outline-none focus:ring-4 focus:ring-turquoise/20"
        >
          {RATINGS.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-3">
        <label htmlFor="notes" className="block text-sm font-medium text-ink/80">
          Notes (optional)
        </label>
        <textarea
          id="notes"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="What did you observe?"
          className="mt-1 w-full rounded-lg border border-turquoise/25 px-3 py-2 text-ink outline-none focus:ring-4 focus:ring-turquoise/20"
        />
      </div>

      {error && <p className="mt-2 text-sm text-coral">{error}</p>}

      <div className="mt-4 flex gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-turquoise px-4 py-2 font-semibold text-white transition hover:bg-deep disabled:opacity-50"
        >
          {submitting ? "Saving..." : isEditing ? "Save changes" : "Submit report"}
        </button>

        {isEditing && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="rounded-lg border border-turquoise/25 px-4 py-2 font-semibold text-ink/70 transition hover:bg-turquoise/5"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default ReportForm;