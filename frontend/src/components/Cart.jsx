import { useCart } from '../context/CartContext';

export default function Cart({ onCheckout, checkoutLoading }) {
  const { items, total, removeItem, setQuantity } = useCart();

  return (
    <aside className="flex h-full min-h-[320px] w-full max-w-md flex-col rounded-3xl border border-amber-900/10 bg-white p-6 shadow-md transition-all lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)]">
      <h2 className="font-display text-2xl font-bold text-coffee-dark">Your Cart</h2>
      <p className="mt-1 text-sm text-stone-500">Review items before checkout</p>

      <div className="mt-6 flex-1 overflow-y-auto pr-2">
        {items.length === 0 ? (
          <div className="flex h-40 flex-col items-center justify-center rounded-2xl bg-cream/30 text-center">
            <span className="text-4xl opacity-50">🛒</span>
            <p className="mt-3 text-sm font-medium text-stone-500">Your cart is empty.</p>
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {items.map((line) => (
              <div key={line._id} className="flex items-start gap-4 py-4 first:pt-0">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-stone-800">{line.name}</p>
                  <p className="text-sm text-stone-500">₹{line.price} each</p>
                  <div className="mt-3 flex items-center gap-3">
                    <button
                      type="button"
                      aria-label="Decrease"
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-100 text-lg font-medium text-stone-600 transition-colors hover:bg-stone-200 active:bg-stone-300"
                      onClick={() => setQuantity(line._id, line.quantity - 1)}
                    >
                      −
                    </button>
                    <span className="w-6 text-center text-sm font-semibold">{line.quantity}</span>
                    <button
                      type="button"
                      aria-label="Increase"
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-100 text-lg font-medium text-stone-600 transition-colors hover:bg-stone-200 active:bg-stone-300"
                      onClick={() => setQuantity(line._id, line.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-coffee">₹{line.price * line.quantity}</p>
                  <button
                    type="button"
                    className="mt-2 text-xs font-medium text-red-500 transition-colors hover:text-red-700 hover:underline"
                    onClick={() => removeItem(line._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 border-t border-stone-200 pt-5">
        <div className="flex items-center justify-between text-xl font-bold text-coffee-dark">
          <span>Total</span>
          <span>₹{Math.round(total)}</span>
        </div>
        <button
          type="button"
          disabled={items.length === 0 || checkoutLoading}
          onClick={onCheckout}
          className="mt-5 w-full rounded-full bg-coffee py-3.5 text-center text-sm font-bold text-white shadow-md transition-all duration-300 hover:bg-coffee-dark hover:shadow-lg disabled:cursor-not-allowed disabled:bg-stone-300 disabled:shadow-none active:scale-95"
        >
          {checkoutLoading ? 'Placing order…' : 'Place Order'}
        </button>
      </div>
    </aside>
  );
}
