import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await signup({ name, email, password, role });
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-lagoon px-4 py-16">
      <div className="mx-auto max-w-md">
        <h1 className="font-display text-3xl font-medium text-ink">Create an account</h1>
        <p className="mt-2 text-sm text-ink/60">
          Business owners can list facilities; everyone can submit safety reports.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-ink/80">
              Name
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-turquoise/25 bg-cream px-4 py-2.5 text-ink outline-none focus:ring-4 focus:ring-turquoise/20"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-ink/80">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-turquoise/25 bg-cream px-4 py-2.5 text-ink outline-none focus:ring-4 focus:ring-turquoise/20"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-ink/80">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-turquoise/25 bg-cream px-4 py-2.5 text-ink outline-none focus:ring-4 focus:ring-turquoise/20"
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-ink/80">
              I am a...
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 w-full rounded-lg border border-turquoise/25 bg-cream px-4 py-2.5 text-ink outline-none focus:ring-4 focus:ring-turquoise/20"
            >
              <option value="user">Visitor — I want to check conditions</option>
              <option value="business_owner">Business owner — I manage a facility</option>
            </select>
          </div>

          {error && <p className="text-sm text-coral">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-turquoise px-4 py-2.5 font-semibold text-white transition hover:bg-deep disabled:opacity-50"
          >
            {submitting ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <p className="mt-6 text-sm text-ink/60">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-deep hover:text-ink">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}

export default Signup;