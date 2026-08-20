function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-slate-700">CoastSafe</p>
            <p>Know Before You Go.</p>
          </div>

          <p>
            Coastal weather and marine information for general planning and
            awareness.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;