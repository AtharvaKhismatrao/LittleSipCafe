import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError('');
      await login(email, password);
      navigate('/');
    } catch {
      setError('Invalid email or password.');
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
      <div className="rounded-[2rem] border border-amber-900/10 bg-white p-10 shadow-card">
        <h1 className="font-display text-3xl font-bold text-coffee-dark">Welcome back</h1>
        <p className="mt-2 text-sm text-stone-600">Sign in to your account</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
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

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            className="w-full rounded-full bg-coffee py-3 font-semibold text-white shadow-md hover:bg-coffee-light"
          >
            Sign In
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-stone-600">
          Don't have an account?{' '}
          <Link to="/signup" className="font-semibold text-coffee hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
