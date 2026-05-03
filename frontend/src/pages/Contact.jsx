import { useState } from 'react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSent(true);
    setForm({ name: '', email: '', subject: '', message: '' });
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <h1 className="font-display text-4xl font-bold text-coffee-dark">Contact Us</h1>
          <p className="mt-3 text-stone-600">
            Questions, feedback, or catering? We would love to hear from you.
          </p>

          <div className="mt-10 space-y-6 rounded-[2rem] border border-amber-900/10 bg-white p-8 shadow-card">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-coffee">Location</p>
              <p className="mt-2 leading-relaxed text-stone-700">
                Shop No. 12, Linking Road
                <br />
                Bandra West
                <br />
                Mumbai, Maharashtra 400050
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-coffee">Phone</p>
              <a href="tel:+912226401234" className="mt-2 block text-lg text-coffee hover:underline">
                +91 22 2640 1234
              </a>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-coffee">Email</p>
              <a
                href="mailto:hello@littlesipcafe.com"
                className="mt-2 block text-lg text-coffee hover:underline"
              >
                hello@littlesipcafe.com
              </a>
            </div>
          </div>
        </div>

        <div>
          <form
            onSubmit={handleSubmit}
            className="rounded-[2rem] border border-amber-900/10 bg-white p-8 shadow-card"
          >
            <h2 className="font-display text-2xl font-semibold text-coffee-dark">Send a message</h2>
            {sent && (
              <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                Thank you! We will get back to you soon. (Demo — message not sent to a server.)
              </p>
            )}
            <label className="mt-6 block text-sm font-medium text-stone-700">Name</label>
            <input
              required
              name="name"
              value={form.name}
              onChange={handleChange}
              className="mt-1 w-full rounded-2xl border border-stone-200 bg-cream/40 px-4 py-3 outline-none ring-coffee/30 focus:ring-2"
            />
            <label className="mt-4 block text-sm font-medium text-stone-700">Email</label>
            <input
              required
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="mt-1 w-full rounded-2xl border border-stone-200 bg-cream/40 px-4 py-3 outline-none ring-coffee/30 focus:ring-2"
            />
            <label className="mt-4 block text-sm font-medium text-stone-700">Subject</label>
            <input
              required
              name="subject"
              value={form.subject}
              onChange={handleChange}
              className="mt-1 w-full rounded-2xl border border-stone-200 bg-cream/40 px-4 py-3 outline-none ring-coffee/30 focus:ring-2"
            />
            <label className="mt-4 block text-sm font-medium text-stone-700">Message</label>
            <textarea
              required
              name="message"
              rows={5}
              value={form.message}
              onChange={handleChange}
              className="mt-1 w-full rounded-2xl border border-stone-200 bg-cream/40 px-4 py-3 outline-none ring-coffee/30 focus:ring-2"
            />
            <button
              type="submit"
              className="mt-6 w-full rounded-full bg-coffee py-3.5 font-semibold text-white shadow-md hover:bg-coffee-light"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
