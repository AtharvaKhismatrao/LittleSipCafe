import { useEffect, useState } from 'react';
import {
  adminLogin,
  createMenuItem,
  deleteMenuItem,
  fetchAdminOrders,
  fetchAdminReservations,
  fetchMenu,
  fetchReviews,
  setAuthToken,
  updateMenuItem,
  updateOrderStatus,
} from '../services/api';

const TABS = ['Menu', 'Reservations', 'Reviews', 'Orders'];

export default function AdminDashboard() {
  const [token, setToken] = useState(() => localStorage.getItem('adminToken') || '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [tab, setTab] = useState('Menu');

  const [menu, setMenu] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loadError, setLoadError] = useState('');

  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: '',
    category: 'Coffee',
    price: '',
    description: '',
    image: '',
  });

  useEffect(() => {
    if (token) {
      setAuthToken(token);
    } else {
      setAuthToken(null);
    }
  }, [token]);

  async function refreshTab() {
    setLoadError('');
    try {
      if (tab === 'Menu') {
        const data = await fetchMenu();
        setMenu(data);
      } else if (tab === 'Reservations') {
        const data = await fetchAdminReservations();
        setReservations(data);
      } else if (tab === 'Reviews') {
        const data = await fetchReviews();
        setReviews(data);
      } else if (tab === 'Orders') {
        const data = await fetchAdminOrders();
        setOrders(data);
      }
    } catch (e) {
      if (e.response?.status === 401) {
        setToken('');
        localStorage.removeItem('adminToken');
        setLoginError('Session expired. Please log in again.');
      } else {
        setLoadError('Failed to load data.');
      }
    }
  }

  useEffect(() => {
    if (!token) return;
    refreshTab();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, tab]);

  async function handleLogin(e) {
    e.preventDefault();
    setLoginError('');
    try {
      const { token: t } = await adminLogin(email, password);
      setToken(t);
      localStorage.setItem('adminToken', t);
      setPassword('');
    } catch {
      setLoginError('Invalid email or password.');
    }
  }

  function logout() {
    setToken('');
    localStorage.removeItem('adminToken');
    setAuthToken(null);
  }

  function startCreate() {
    setEditing('new');
    setForm({
      name: '',
      category: 'Coffee',
      price: '',
      description: '',
      image: '',
    });
  }

  function startEdit(item) {
    setEditing(item._id);
    setForm({
      name: item.name,
      category: item.category,
      price: String(item.price),
      description: item.description || '',
      image: item.image || '',
    });
  }

  async function saveMenu(e) {
    e.preventDefault();
    try {
      const payload = {
        name: form.name,
        category: form.category,
        price: Number(form.price),
        description: form.description,
        image: form.image,
      };
      if (editing === 'new') {
        await createMenuItem(payload);
      } else {
        await updateMenuItem(editing, payload);
      }
      setEditing(null);
      const data = await fetchMenu();
      setMenu(data);
    } catch {
      setLoadError('Could not save menu item.');
    }
  }

  async function removeItem(id) {
    if (!confirm('Delete this item?')) return;
    try {
      await deleteMenuItem(id);
      setMenu((m) => m.filter((x) => x._id !== id));
    } catch {
      setLoadError('Could not delete.');
    }
  }

  async function changeOrderStatus(id, status) {
    try {
      await updateOrderStatus(id, status);
      setOrders((o) => o.map((x) => (x._id === id ? { ...x, status } : x)));
    } catch {
      setLoadError('Could not update order.');
    }
  }

  if (!token) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
        <div className="rounded-[2rem] border border-amber-900/10 bg-white p-10 shadow-card">
          <h1 className="font-display text-3xl font-bold text-coffee-dark">Admin Login</h1>
          <p className="mt-2 text-sm text-stone-600">Little Sip Cafe dashboard</p>
          <form onSubmit={handleLogin} className="mt-8 space-y-4">
            <label className="block text-sm font-medium text-stone-700">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-stone-200 px-4 py-3 outline-none ring-coffee/30 focus:ring-2"
            />
            <label className="block text-sm font-medium text-stone-700">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-stone-200 px-4 py-3 outline-none ring-coffee/30 focus:ring-2"
            />
            {loginError && <p className="text-sm text-red-600">{loginError}</p>}
            <button
              type="submit"
              className="w-full rounded-full bg-coffee py-3 font-semibold text-white shadow-md hover:bg-coffee-light"
            >
              Sign in
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-coffee-dark">Admin Dashboard</h1>
          <p className="text-sm text-stone-600">Manage menu, reservations, reviews, and orders.</p>
        </div>
        <button
          type="button"
          onClick={logout}
          className="rounded-full border border-stone-300 px-5 py-2 text-sm font-medium hover:bg-stone-100"
        >
          Log out
        </button>
      </div>

      <div className="mt-8 flex flex-wrap gap-2 border-b border-stone-200 pb-4">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-full px-5 py-2 text-sm font-semibold ${
              tab === t ? 'bg-coffee text-white' : 'bg-white text-stone-600 ring-1 ring-stone-200'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {loadError && <p className="mt-4 text-red-600">{loadError}</p>}

      {tab === 'Menu' && (
        <div className="mt-8">
          <div className="mb-6 flex justify-end">
            <button
              type="button"
              onClick={startCreate}
              className="rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-accent-light"
            >
              Add menu item
            </button>
          </div>

          {(editing === 'new' || (editing && editing !== 'new')) && (
            <form
              onSubmit={saveMenu}
              className="mb-8 grid gap-4 rounded-3xl border border-amber-900/10 bg-white p-6 shadow-card sm:grid-cols-2"
            >
              <h2 className="sm:col-span-2 font-display text-xl font-semibold text-coffee-dark">
                {editing === 'new' ? 'New item' : 'Edit item'}
              </h2>
              <label className="block sm:col-span-2">
                <span className="text-sm font-medium">Name</span>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-stone-200 px-3 py-2"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium">Category</span>
                <select
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-stone-200 px-3 py-2"
                >
                  {['Coffee', 'Pastries', 'Food'].map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-sm font-medium">Price (₹)</span>
                <input
                  required
                  type="number"
                  min={0}
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-stone-200 px-3 py-2"
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="text-sm font-medium">Image URL</span>
                <input
                  value={form.image}
                  onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                  placeholder="https://..."
                  className="mt-1 w-full rounded-xl border border-stone-200 px-3 py-2"
                />
                <p className="mt-1 text-xs text-stone-500">
                  Use a hosted image URL. Vercel serverless functions do not keep local uploads.
                </p>
              </label>
              <label className="block sm:col-span-2">
                <span className="text-sm font-medium">Description</span>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-stone-200 px-3 py-2"
                />
              </label>
              <div className="flex gap-2 sm:col-span-2">
                <button
                  type="submit"
                  className="rounded-full bg-coffee px-6 py-2 text-sm font-semibold text-white"
                >
                  Save
                </button>
                <button
                  type="button"
                  className="rounded-full px-4 py-2 text-sm text-stone-600 hover:bg-stone-100"
                  onClick={() => setEditing(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="overflow-x-auto rounded-3xl border border-stone-200 bg-white shadow-card">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-cream/80 text-stone-600">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {menu.map((item) => (
                  <tr key={item._id} className="border-t border-stone-100">
                    <td className="px-4 py-3 font-medium">{item.name}</td>
                    <td className="px-4 py-3">{item.category}</td>
                    <td className="px-4 py-3">₹{item.price}</td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        className="mr-2 text-coffee hover:underline"
                        onClick={() => startEdit(item)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="text-red-600 hover:underline"
                        onClick={() => removeItem(item._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'Reservations' && (
        <div className="mt-8 space-y-4">
          {reservations.map((r) => (
            <div
              key={r._id}
              className="rounded-3xl border border-amber-900/10 bg-white p-6 shadow-card"
            >
              <p className="font-semibold text-coffee-dark">{r.name}</p>
              <p className="text-sm text-stone-600">
                {r.email} · {r.phone}
              </p>
              <p className="mt-2 text-sm">
                {r.guests} guests · {r.date} at {r.time}
              </p>
              {r.specialRequest && (
                <p className="mt-2 text-sm text-stone-600">Note: {r.specialRequest}</p>
              )}
            </div>
          ))}
          {reservations.length === 0 && <p className="text-stone-500">No reservations yet.</p>}
        </div>
      )}

      {tab === 'Reviews' && (
        <div className="mt-8 space-y-4">
          {reviews.map((r) => (
            <div
              key={r._id}
              className="rounded-3xl border border-amber-900/10 bg-white p-6 shadow-card"
            >
              <div className="flex justify-between gap-2">
                <span className="font-semibold">{r.name}</span>
                <span className="text-amber-500">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
              </div>
              <p className="mt-2 text-stone-700">{r.comment}</p>
              <p className="mt-2 text-xs text-stone-400">
                {new Date(r.date || r.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
          {reviews.length === 0 && <p className="text-stone-500">No reviews yet.</p>}
        </div>
      )}

      {tab === 'Orders' && (
        <div className="mt-8 space-y-6">
          {orders.map((o) => (
            <div
              key={o._id}
              className="rounded-3xl border border-amber-900/10 bg-white p-6 shadow-card"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-mono text-xs text-stone-500">{o._id}</p>
                <span className="rounded-full bg-cream px-3 py-1 text-xs font-semibold uppercase text-coffee">
                  {o.status}
                </span>
              </div>
              <p className="mt-2 font-semibold text-coffee-dark">{o.customerName}</p>
              <p className="text-lg font-bold text-coffee">₹{o.totalPrice}</p>
              <ul className="mt-3 space-y-1 text-sm text-stone-600">
                {o.items.map((line, idx) => (
                  <li key={idx}>
                    {line.name} × {line.quantity} — ₹{line.price * line.quantity}
                  </li>
                ))}
              </ul>
              <label className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                <span>Status:</span>
                <select
                  value={o.status}
                  onChange={(e) => changeOrderStatus(o._id, e.target.value)}
                  className="rounded-xl border border-stone-200 px-3 py-2"
                >
                  {['pending', 'preparing', 'ready', 'completed', 'cancelled'].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          ))}
          {orders.length === 0 && <p className="text-stone-500">No orders yet.</p>}
        </div>
      )}
    </div>
  );
}
