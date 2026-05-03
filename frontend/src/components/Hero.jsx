import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="relative min-h-[85vh] overflow-hidden rounded-b-[2.5rem]">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1920&q=80')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-coffee-dark/90 via-coffee/75 to-amber-900/80" />
      <div className="relative mx-auto flex min-h-[85vh] max-w-5xl flex-col items-center justify-center px-4 text-center sm:px-6">
        <p className="mb-4 rounded-full bg-white/10 px-4 py-1 text-sm font-medium text-amber-100 backdrop-blur">
          Est. Mumbai · Bandra West
        </p>
        <h1 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
          Welcome to Little Sip Cafe
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-amber-50/95 sm:text-xl">
          Where every cup tells a story. Crafted with passion, served with love.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/order"
            className="rounded-full bg-accent px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-black/20 transition hover:bg-accent-light hover:shadow-xl"
          >
            Order Now
          </Link>
          <Link
            to="/menu"
            className="rounded-full border-2 border-white/80 bg-white/10 px-8 py-3.5 text-base font-semibold text-white backdrop-blur transition hover:bg-white/20"
          >
            View Menu
          </Link>
        </div>
      </div>
    </section>
  );
}
