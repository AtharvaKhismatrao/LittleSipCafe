import { useState } from 'react';
import { postReservation } from '../services/api';

const initial = {
  name: '',
  email: '',
  phone: '',
  guests: '2',
  date: '',
  time: '',
  specialRequest: '',
};

export default function Reservations() {
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await postReservation({
        ...form,
        guests: Number(form.guests),
      });
      setMessage('Reservation received! We will confirm shortly.');
      setForm(initial);
    } catch {
      setMessage('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="font-display text-4xl font-bold text-coffee-dark">Reserve a Table</h1>
        <p className="mt-3 text-stone-600">
          Share your details and we will hold a cozy spot for you at Little Sip Cafe.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-10 space-y-5 rounded-[2rem] border border-amber-900/10 bg-white p-8 shadow-card"
      >
        {['name', 'email', 'phone'].map((field) => (
          <label key={field} className="block">
            <span className="text-sm font-medium text-stone-700">
              {field === 'name'
                ? 'Full Name'
                : field === 'email'
                  ? 'Email'
                  : 'Phone Number'}
            </span>
            <input
              required
              name={field}
              type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
              value={form[field]}
              onChange={handleChange}
              className="mt-1 w-full rounded-2xl border border-stone-200 bg-cream/40 px-4 py-3 outline-none ring-coffee/30 focus:ring-2"
            />
          </label>
        ))}

        <label className="block">
          <span className="text-sm font-medium text-stone-700">Number of Guests</span>
          <input
            required
            name="guests"
            type="number"
            min={1}
            max={20}
            value={form.guests}
            onChange={handleChange}
            className="mt-1 w-full rounded-2xl border border-stone-200 bg-cream/40 px-4 py-3 outline-none ring-coffee/30 focus:ring-2"
          />
        </label>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-stone-700">Date</span>
            <input
              required
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              className="mt-1 w-full rounded-2xl border border-stone-200 bg-cream/40 px-4 py-3 outline-none ring-coffee/30 focus:ring-2"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-stone-700">Time</span>
            <input
              required
              name="time"
              type="time"
              value={form.time}
              onChange={handleChange}
              className="mt-1 w-full rounded-2xl border border-stone-200 bg-cream/40 px-4 py-3 outline-none ring-coffee/30 focus:ring-2"
            />
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-medium text-stone-700">Special Requests</span>
          <textarea
            name="specialRequest"
            rows={4}
            value={form.specialRequest}
            onChange={handleChange}
            placeholder="Allergies, occasion, seating preference…"
            className="mt-1 w-full rounded-2xl border border-stone-200 bg-cream/40 px-4 py-3 outline-none ring-coffee/30 focus:ring-2"
          />
        </label>

        {message && (
          <p
            className={`rounded-2xl px-4 py-3 text-sm ${
              message.startsWith('Reservation')
                ? 'bg-emerald-50 text-emerald-800'
                : 'bg-red-50 text-red-800'
            }`}
          >
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-coffee py-3.5 text-center font-semibold text-white shadow-md transition hover:bg-coffee-light disabled:opacity-60"
        >
          {loading ? 'Sending…' : 'Request Reservation'}
        </button>
      </form>
    </div>
  );
}
