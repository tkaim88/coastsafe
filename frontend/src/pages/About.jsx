function About() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-slate-950 text-white">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-cyan-300">
            About
          </p>

          <h1 className="mt-2 text-4xl font-black sm:text-5xl">
            About CoastSafe
          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-300">
            CoastSafe is designed to make coastal weather and marine
            information easier to discover and understand.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <section className="rounded-2xl border border-slate-200 bg-white p-8">
            <h2 className="text-2xl font-bold text-slate-900">
              The problem
            </h2>

            <p className="mt-4 leading-7 text-slate-600">
              Coastal visitors may need information from several different
              sources before planning a beach visit or outdoor activity.
              CoastSafe brings relevant weather and marine conditions together
              in one focused interface.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-8">
            <h2 className="text-2xl font-bold text-slate-900">
              Built for growth
            </h2>

            <p className="mt-4 leading-7 text-slate-600">
              Phase 1 is a React application using public APIs. The project is
              designed to grow into a Flask and PostgreSQL application in
              Phase 2 and an authenticated platform with user-owned data in
              Phase 3.
            </p>
          </section>

          <section className="rounded-2xl border border-amber-200 bg-amber-50 p-8">
            <h2 className="text-2xl font-bold text-amber-950">
              Important information
            </h2>

            <p className="mt-4 leading-7 text-amber-900">
              CoastSafe is an informational planning tool. It does not replace
              lifeguards, emergency services, official warnings, professional
              marine advice, or navigation systems.
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}

export default About;