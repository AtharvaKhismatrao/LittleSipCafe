import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const linkClass = ({ isActive }) =>
  `px-3 py-2 rounded-full text-sm font-medium transition-colors ${
    isActive
      ? 'bg-coffee text-white shadow-md'
      : 'text-stone-700 hover:bg-cream-dark/80'
  }`;

export default function Navbar() {
  const { items } = useCart();
  const { user, logout } = useAuth();
  const count = items.reduce((n, i) => n + i.quantity, 0);

  return (
    <header className="sticky top-0 z-50 border-b border-amber-900/10 bg-cream/95 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-coffee text-lg font-bold text-white shadow-md">
            LS
          </span>
          <div>
            <p className="font-display text-lg font-semibold leading-tight text-coffee-dark">
              Little Sip Cafe
            </p>
            <p className="text-xs text-stone-500">Artisan coffee & bites</p>
          </div>
        </Link>

        <nav className="flex flex-1 flex-wrap items-center justify-center gap-1 sm:justify-end">
          <NavLink to="/" end className={linkClass}>
            Home
          </NavLink>
          <NavLink to="/order" className={linkClass}>
            Order
            {count > 0 && (
              <span className="ml-1 inline-flex min-w-[1.25rem] justify-center rounded-full bg-accent px-1.5 text-xs text-white">
                {count}
              </span>
            )}
          </NavLink>
          <NavLink to="/menu" className={linkClass}>
            Menu
          </NavLink>
          <NavLink to="/reservations" className={linkClass}>
            Reserve
          </NavLink>
          <NavLink to="/reviews" className={linkClass}>
            Reviews
          </NavLink>
          <NavLink to="/loyalty" className={linkClass}>
            Rewards
          </NavLink>
          <NavLink to="/contact" className={linkClass}>
            Contact
          </NavLink>
          
          {user ? (
            <div className="flex items-center gap-3 border-l border-stone-200 pl-3">
              <span className="text-sm font-semibold text-coffee-dark truncate max-w-[120px]">
                {user.name}
              </span>
              <button
                onClick={logout}
                className="rounded-full border border-stone-300 px-3 py-1.5 text-xs font-semibold text-stone-600 hover:bg-stone-100"
              >
                Sign out
              </button>
            </div>
          ) : (
            <NavLink
              to="/login"
              className="rounded-full bg-coffee px-4 py-2 text-sm font-medium text-white hover:bg-coffee-light shadow-md ml-2"
            >
              Log in
            </NavLink>
          )}
          
          <NavLink
            to="/admin"
            className="rounded-full border border-coffee/30 px-3 py-2 text-xs font-semibold text-coffee hover:bg-coffee hover:text-white"
          >
            Admin
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
