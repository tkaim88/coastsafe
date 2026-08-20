import { Link, NavLink } from "react-router-dom";

const navLinkClass = ({ isActive }) =>
  [
    "rounded-lg px-3 py-2 text-sm font-medium transition",
    isActive
      ? "bg-cyan-500/15 text-cyan-300"
      : "text-slate-300 hover:bg-white/10 hover:text-white",
  ].join(" ");

function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500 text-xl shadow-lg shadow-cyan-500/20">
            🌊
          </div>

          <div>
            <p className="text-lg font-bold tracking-tight text-white">
              CoastSafe
            </p>
            <p className="text-xs text-slate-400">Know Before You Go.</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 sm:flex">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>

          <NavLink to="/explore" className={navLinkClass}>
            Explore
          </NavLink>

          <NavLink to="/about" className={navLinkClass}>
            About
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;