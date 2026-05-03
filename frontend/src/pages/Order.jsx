import { useEffect, useMemo, useState } from 'react';
import MenuCard from '../components/MenuCard';
import Cart from '../components/Cart';
import { useCart } from '../context/CartContext';
import { fetchMenu, postOrder } from '../services/api';
import PaymentModal from '../components/PaymentModal';
import { useAuth } from '../context/AuthContext';

const FILTERS = ['All', 'Coffee', 'Pastries', 'Food'];

export default function Order() {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('All');
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [msg, setMsg] = useState('');
  const { addItem, items, total, clearCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const data = await fetchMenu();
        if (!cancelled) setMenu(data);
      } catch (e) {
        if (!cancelled) setError('Could not load menu. Is the server running?');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    if (filter === 'All') return menu;
    return menu.filter((m) => m.category === filter);
  }, [menu, filter]);

  function handleCheckout() {
    if (items.length === 0) return;
    setShowPayment(true);
  }

  async function processOrderPayment() {
    setCheckoutLoading(true);
    setMsg('');
    try {
      await postOrder({
        items: items.map((i) => ({
          name: i.name,
          price: i.price,
          quantity: i.quantity,
        })),
        totalPrice: total,
        customerName: user ? user.name : 'Guest',
        user: user ? user.id : undefined,
        status: 'pending',
      });
      clearCart();
      setMsg('Payment successful! Order placed. We will start preparing it shortly.');
    } catch (e) {
      setMsg('Could not place order. Please try again.');
    } finally {
      setCheckoutLoading(false);
      setShowPayment(false);
    }
  }

  const skeletonArray = Array.from({ length: 6 });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 text-center md:text-left">
        <h1 className="font-display text-3xl font-bold text-coffee-dark sm:text-4xl">
          Order Online
        </h1>
        <p className="mt-2 max-w-2xl text-stone-600">
          Pick your favourites, tweak quantities in the cart, and place your order in one go.
        </p>
      </div>

      {msg && (
        <div
          className={`mb-6 rounded-2xl px-4 py-3 text-sm ${
            msg.startsWith('Order placed')
              ? 'bg-emerald-50 text-emerald-800'
              : 'bg-red-50 text-red-800'
          }`}
        >
          {msg}
        </div>
      )}

      <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
        <div className="min-w-0 flex-1">
          <div className="mb-6 flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition-all duration-300 ${
                  filter === f
                    ? 'bg-coffee text-white shadow-md'
                    : 'bg-white text-stone-600 ring-1 ring-stone-200 hover:bg-cream-dark hover:text-stone-800'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {error && <p className="text-red-600">{error}</p>}
          {loading && (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {skeletonArray.map((_, i) => (
                <div key={i} className="animate-pulse rounded-2xl bg-white p-4 shadow-md ring-1 ring-stone-200/60">
                  <div className="h-52 w-full rounded-xl bg-stone-200"></div>
                  <div className="mt-4 h-6 w-3/4 rounded bg-stone-200"></div>
                  <div className="mt-2 h-4 w-full rounded bg-stone-200"></div>
                  <div className="mt-1 h-4 w-5/6 rounded bg-stone-200"></div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="h-6 w-16 rounded bg-stone-200"></div>
                    <div className="h-10 w-28 rounded-full bg-stone-200"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-stone-50 py-16 text-center">
              <span className="text-4xl">🍽️</span>
              <h3 className="mt-4 font-display text-lg font-semibold text-stone-800">No items found</h3>
              <p className="mt-2 text-sm text-stone-500">We couldn't find any menu items for this category.</p>
            </div>
          )}

          {!loading && !error && filtered.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((item) => (
                <MenuCard key={item._id} item={item} onAdd={addItem} />
              ))}
            </div>
          )}
        </div>

        <div className="w-full shrink-0 lg:w-[380px] lg:max-w-[40%]">
          <Cart onCheckout={handleCheckout} checkoutLoading={checkoutLoading || showPayment} />
        </div>
      </div>
      
      {showPayment && (
        <PaymentModal 
          total={Math.round(total)}
          onConfirm={processOrderPayment}
          onCancel={() => setShowPayment(false)}
        />
      )}
    </div>
  );
}
