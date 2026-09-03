import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LOGIN_PHOTO =
  "https://images.pexels.com/photos/29389351/pexels-photo-29389351.jpeg?auto=compress&cs=tinysrgb&w=1200";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login({ email, password });
      const destination = location.state?.from?.pathname ?? "/";
      navigate(destination, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="grid min-h-screen bg-lagoon lg:grid-cols-2">
      {/* Photo panel — hidden on small screens so the form stays the
          priority on mobile, contained cleanly on larger screens. */}
      <div className="relative hidden overflow-hidden lg:block">
        <img
          src={LOGIN_PHOTO}
          alt="Calm ocean horizon"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-turquoise/20" />
      </div>

      <div className="flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <h1 className="font-display text-3xl font-medium text-ink">Log in</h1>
          <p className="mt-2 text-sm text-ink/60">
            Log in to submit safety reports and manage your listings.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-lg border border-turquoise/25 bg-cream px-4 py-2.5 text-ink outline-none focus:ring-4 focus:ring-turquoise/20"
              />
            </div>

            {error && <p className="text-sm text-coral">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-turquoise px-4 py-2.5 font-semibold text-white transition hover:bg-deep disabled:opacity-50"
            >
              {submitting ? "Logging in..." : "Log in"}
            </button>
          </form>

          <p className="mt-6 text-sm text-ink/60">
            Don't have an account?{" "}
            <Link to="/signup" className="font-medium text-deep hover:text-ink">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default Login;