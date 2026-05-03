import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError('');
      await registerUser({ name, email, password });
      await login(email, password); // Log in right after registering
      navigate('/');
    } catch {
      setError('Could not create account. Email might be in use.');
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
      <div className="rounded-[2rem] border border-amber-900/10 bg-white p-10 shadow-card">
        <h1 className="font-display text-3xl font-bold text-coffee-dark">Create account</h1>
        <p className="mt-2 text-sm text-stone-600">Join us for coffee perks!</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <label className="block text-sm font-medium text-stone-700">Full Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-2xl border border-stone-200 px-4 py-3 outline-none ring-coffee/30 focus:ring-2"
          />

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
            minLength={6}
          />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            className="w-full rounded-full bg-coffee py-3 font-semibold text-white shadow-md hover:bg-coffee-light"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-stone-600">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-coffee hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
