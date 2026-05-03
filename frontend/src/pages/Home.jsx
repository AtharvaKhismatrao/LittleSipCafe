import Hero from '../components/Hero';

export default function Home() {
  return (
    <div>
      <Hero />
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          {[
            {
              title: 'Single-origin beans',
              text: 'Ethically sourced and roasted in small batches for depth you can taste.',
            },
            {
              title: 'Fresh daily bakes',
              text: 'Pastries and breads from our kitchen, perfect with your favourite brew.',
            },
            {
              title: 'Neighbourhood vibe',
              text: 'A calm corner on Linking Road to work, meet, or simply sip slowly.',
            },
          ].map((b) => (
            <div
              key={b.title}
              className="rounded-3xl border border-amber-900/10 bg-white p-8 shadow-card"
            >
              <h2 className="font-display text-xl font-semibold text-coffee-dark">{b.title}</h2>
              <p className="mt-3 text-stone-600">{b.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
