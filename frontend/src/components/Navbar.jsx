import { useNavigate, Link, NavLink } from "react-router-dom";
import SearchBar from "./SearchBar";
import { useAuth } from "../context/AuthContext";

const navLinkClass = ({ isActive }) =>
  [
    "rounded-lg px-3 py-2 text-sm font-medium transition",
    isActive
      ? "bg-cyan-500/25 text-white"
      : "text-slate-100 hover:bg-white/10 hover:text-white",
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
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500 text-xl shadow-lg shadow-cyan-500/20">
              🌊
            </div>
            <div>
              <p className="text-lg font-bold tracking-tight text-white">CoastSafe</p>
              <p className="text-xs text-slate-400">Know Before You Go.</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-2 sm:flex">
            <NavLink to="/" className={navLinkClass}>Home</NavLink>
            <NavLink to="/explore" className={navLinkClass} style={{ color: "#ffffff" }}>Explore</NavLink>
            <NavLink to="/about" className={navLinkClass}>About</NavLink>

            {isAuthenticated ? (
              <>
                <span className="px-3 text-sm text-slate-200">{user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={navLinkClass}>Log in</NavLink>
                <NavLink to="/signup" className={navLinkClass}>Sign up</NavLink>
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
