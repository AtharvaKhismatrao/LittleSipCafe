import { useEffect, useState } from 'react';
import { fetchReviews, postReview } from '../services/api';

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState('');

  function load() {
    fetchReviews()
      .then(setReviews)
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setMsg('');
    try {
      await postReview({ name, rating: Number(rating), comment });
      setName('');
      setComment('');
      setRating(5);
      setMsg('Thanks for your review!');
      load();
    } catch {
      setMsg('Could not submit review.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="font-display text-4xl font-bold text-coffee-dark">Guest Reviews</h1>
        <p className="mt-3 text-stone-600">Tell us how we did — we read every note.</p>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-5">
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-2 rounded-[2rem] border border-amber-900/10 bg-white p-8 shadow-card"
        >
          <h2 className="font-display text-xl font-semibold text-coffee-dark">Write a review</h2>
          <label className="mt-4 block text-sm font-medium text-stone-700">Name</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-2xl border border-stone-200 bg-cream/40 px-4 py-3 outline-none ring-coffee/30 focus:ring-2"
          />
          <label className="mt-4 block text-sm font-medium text-stone-700">Rating</label>
          <select
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="mt-1 w-full rounded-2xl border border-stone-200 bg-cream/40 px-4 py-3 outline-none ring-coffee/30 focus:ring-2"
          >
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>
                {r} — {r === 5 ? 'Excellent' : r === 4 ? 'Great' : 'Good'}
              </option>
            ))}
          </select>
          <label className="mt-4 block text-sm font-medium text-stone-700">Comment</label>
          <textarea
            required
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="mt-1 w-full rounded-2xl border border-stone-200 bg-cream/40 px-4 py-3 outline-none ring-coffee/30 focus:ring-2"
          />
          {msg && (
            <p
              className={`mt-3 rounded-xl px-3 py-2 text-sm ${
                msg.startsWith('Thanks') ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'
              }`}
            >
              {msg}
            </p>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="mt-4 w-full rounded-full bg-accent py-3 font-semibold text-white shadow-md hover:bg-accent-light disabled:opacity-60"
          >
            {submitting ? 'Submitting…' : 'Submit Review'}
          </button>
        </form>

        <div className="lg:col-span-3">
          {loading ? (
            <p className="text-stone-500">Loading reviews…</p>
          ) : reviews.length === 0 ? (
            <p className="rounded-3xl bg-white p-8 text-stone-600 shadow-card">
              No reviews yet — be the first!
            </p>
          ) : (
            <ul className="space-y-4">
              {reviews.map((r) => (
                <li
                  key={r._id}
                  className="rounded-3xl border border-amber-900/10 bg-white p-6 shadow-card"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold text-coffee-dark">{r.name}</p>
                    <div className="flex text-amber-500" aria-label={`${r.rating} stars`}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i}>{i < r.rating ? '★' : '☆'}</span>
                      ))}
                    </div>
                  </div>
                  <p className="mt-2 text-stone-700">{r.comment}</p>
                  <p className="mt-3 text-xs text-stone-400">
                    {new Date(r.date || r.createdAt).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
