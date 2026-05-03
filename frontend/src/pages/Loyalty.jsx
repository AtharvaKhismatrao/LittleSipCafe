import { useState } from 'react';

export default function Loyalty() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-coffee via-coffee-dark to-amber-900 p-10 text-center text-white shadow-2xl sm:p-14">
        <p className="text-sm font-semibold uppercase tracking-widest text-amber-200/90">
          Little Sip Rewards
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">Loyalty Program</h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-amber-50/95">
          Sip, earn, repeat. Every visit brings you closer to richer perks.
        </p>
      </div>

      <div className="-mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-amber-900/10 bg-white p-8 shadow-card">
          <h2 className="font-display text-2xl font-semibold text-coffee-dark">Earn Points</h2>
          <p className="mt-3 text-stone-600">
            Earn <strong className="text-coffee">1 point</strong> for every{' '}
            <strong className="text-coffee">₹10</strong> spent on eligible purchases in-store and
            online.
          </p>
        </div>
        <div className="rounded-3xl border border-amber-900/10 bg-white p-8 shadow-card">
          <h2 className="font-display text-2xl font-semibold text-coffee-dark">Tiers</h2>
          <ul className="mt-4 space-y-3">
            {[
              { name: 'Bronze', perk: 'Welcome treats & birthday reward' },
              { name: 'Silver', perk: 'Bonus points days & free size upgrades' },
              { name: 'Gold', perk: 'Priority seating invites & seasonal previews' },
            ].map((t) => (
              <li
                key={t.name}
                className="flex items-start justify-between gap-4 rounded-2xl bg-cream/60 px-4 py-3"
              >
                <span className="font-semibold text-coffee">{t.name}</span>
                <span className="text-right text-sm text-stone-600">{t.perk}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-full bg-coffee px-10 py-3.5 font-semibold text-white shadow-lg transition hover:bg-coffee-light"
        >
          Login to View Points
        </button>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-full border-2 border-coffee bg-white px-10 py-3.5 font-semibold text-coffee transition hover:bg-cream"
        >
          Sign Up
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div
            className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="loyalty-title"
          >
            <h2 id="loyalty-title" className="font-display text-2xl font-bold text-coffee-dark">
              Join Little Sip Rewards
            </h2>
            <p className="mt-2 text-sm text-stone-600">
              This demo uses a placeholder flow. In production, connect to your auth provider.
            </p>
            <label className="mt-6 block text-sm font-medium text-stone-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-1 w-full rounded-2xl border border-stone-200 px-4 py-3 outline-none ring-coffee/30 focus:ring-2"
            />
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                className="flex-1 rounded-full bg-accent py-3 font-semibold text-white hover:bg-accent-light"
                onClick={() => {
                  setOpen(false);
                  setEmail('');
                }}
              >
                Continue
              </button>
              <button
                type="button"
                className="rounded-full px-4 text-stone-600 hover:bg-stone-100"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
