const ABOUT_HERO =
  "https://images.pexels.com/photos/29389351/pexels-photo-29389351.jpeg?auto=compress&cs=tinysrgb&w=1600";

function About() {
  return (
    <main className="min-h-screen bg-lagoon">
      <section className="relative isolate overflow-hidden bg-turquoise text-white">
        <div className="absolute inset-0">
          <img
            src={ABOUT_HERO}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-turquoise/70 via-turquoise/70 to-turquoise" />
        </div>

        <div className="relative mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-cream/90">
            About
          </p>
          <h1 className="mt-2 font-display text-4xl font-medium sm:text-5xl">
            Know before you go.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/85">
            CoastSafe brings together live weather, marine conditions, and
            local knowledge for Kenya's coast — so a day at the beach starts
            with information, not guesswork.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <section className="rounded-2xl border border-turquoise/15 bg-cream p-8">
            <h2 className="font-display text-2xl font-medium text-ink">
              The problem
            </h2>
            <p className="mt-4 leading-7 text-ink/70">
              Kenya's coast draws thousands of swimmers, divers, and
              beachgoers every year, but there's no single place to check
              whether the water is calm, whether a beach has a lifeguard on
              duty, or what other visitors are actually experiencing right
              now. People rely on guesswork, word of mouth, or nothing at
              all. CoastSafe exists to close that gap.
            </p>
          </section>

          <section className="rounded-2xl border border-turquoise/15 bg-cream p-8">
            <h2 className="font-display text-2xl font-medium text-ink">
              How it works
            </h2>
            <p className="mt-4 leading-7 text-ink/70">
              Search any coastal location to see live weather and marine
              conditions pulled directly from meteorological data — no
              stale forecasts. From there, you can check verified
              facilities nearby (pools, resorts, water parks) along with
              their lifeguard availability, and read safety reports left
              by other visitors who've actually been there recently.
            </p>
          </section>

          <section className="rounded-2xl border border-turquoise/15 bg-cream p-8">
            <h2 className="font-display text-2xl font-medium text-ink">
              Built for two kinds of people
            </h2>
            <div className="mt-4 grid gap-6 sm:grid-cols-2">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-deep">
                  Visitors
                </p>
                <p className="mt-2 leading-7 text-ink/70">
                  Check conditions before you go, and see what the
                  community is reporting about safety, crowds, and
                  facilities at your destination.
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-deep">
                  Business owners
                </p>
                <p className="mt-2 leading-7 text-ink/70">
                  List your resort, pool, or water park, share your
                  lifeguard hours and amenities, and get discovered by
                  people actively planning a visit nearby.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-turquoise/15 bg-cream p-8">
            <h2 className="font-display text-2xl font-medium text-ink">
              Where the data comes from
            </h2>
            <p className="mt-4 leading-7 text-ink/70">
              Weather and marine conditions are powered by Open-Meteo's
              public weather and marine APIs. Facility listings and safety
              reports come directly from the CoastSafe community — every
              listing is reviewed before it goes live, and every safety
              report is tied to a real account.
            </p>
          </section>

          <section className="rounded-2xl border border-coral/25 bg-coral/10 p-8">
            <h2 className="font-display text-2xl font-medium text-ink">
              Important information
            </h2>
            <p className="mt-4 leading-7 text-ink/80">
              CoastSafe is an informational planning tool. It does not
              replace lifeguards, emergency services, official warnings,
              professional marine advice, or navigation systems. Always
              follow official local guidance and conditions on site.
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}

export default About;