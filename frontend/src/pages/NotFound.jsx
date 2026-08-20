import { Link } from "react-router-dom";

function NotFound() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md text-center">
        <p className="text-7xl font-black text-cyan-500">404</p>

        <h1 className="mt-4 text-3xl font-bold text-slate-900">
          Page not found
        </h1>

        <p className="mt-3 text-slate-500">
          The page you're looking for doesn't exist.
        </p>

        <Link
          to="/"
          className="mt-6 inline-flex rounded-xl bg-slate-950 px-6 py-3 font-semibold text-white transition hover:bg-slate-800"
        >
          Back to CoastSafe
        </Link>
      </div>
    </main>
  );
}

export default NotFound;