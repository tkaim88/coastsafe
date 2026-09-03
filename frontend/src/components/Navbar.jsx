import { useNavigate, Link, NavLink } from "react-router-dom";
import SearchBar from "./SearchBar";
import { useAuth } from "../context/AuthContext";

const navLinkClass = ({ isActive }) =>
  [
    "rounded-lg px-3 py-2 text-sm font-medium transition",
    isActive
      ? "bg-white/25 text-ink"
      : "text-ink/70 hover:bg-white/20 hover:text-ink",
  ].join(" ");

function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  function handleSearch(query) {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  }

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-deep/20 bg-turquoise/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cream text-lg">
              🌊
            </div>
            <div>
              <p className="font-display text-lg font-semibold tracking-tight text-ink">
                CoastSafe
              </p>
              <p className="text-xs text-ink/60">Know before you go.</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 sm:flex">
            <NavLink to="/" className={navLinkClass}>Home</NavLink>
            <NavLink to="/explore" className={navLinkClass}>Explore</NavLink>
            <NavLink to="/about" className={navLinkClass}>About</NavLink>

            {isAuthenticated ? (
              <>
                <NavLink to="/my-listings" className={navLinkClass}>My Listings</NavLink>
                <span className="px-3 text-sm text-ink/70">{user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-ink/60 transition hover:bg-white/20 hover:text-ink"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={navLinkClass}>Log in</NavLink>
                <NavLink
                  to="/signup"
                  className="rounded-lg bg-coral px-3 py-2 text-sm font-semibold text-white transition hover:bg-coral/90"
                >
                  Sign up
                </NavLink>
              </>
            )}
          </nav>
        </div>

        <div className="w-full sm:mx-auto sm:max-w-md">
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>
    </header>
  );
}

export default Navbar;