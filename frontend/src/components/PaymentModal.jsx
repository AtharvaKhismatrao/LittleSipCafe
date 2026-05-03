import { useState } from 'react';

export default function PaymentModal({ total, onConfirm, onCancel }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handlePayment(e) {
    e.preventDefault();
    setLoading(true);
    // Simulate payment gateway delay (e.g. Stripe checkout simulation)
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        onConfirm(); // Trigger backend order creation
      }, 1500);
    }, 2000);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-[2rem] bg-white p-8 shadow-2xl relative overflow-hidden">
        {loading && (
          <div className="absolute inset-0 bg-white/90 z-10 flex flex-col items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-coffee border-t-transparent" />
            <p className="mt-4 font-semibold text-stone-600">Processing secure payment…</p>
          </div>
        )}

        {success && (
          <div className="absolute inset-0 bg-emerald-500 z-20 flex flex-col items-center justify-center text-white">
            <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center mb-4">
              <span className="text-3xl text-emerald-500 font-bold">✓</span>
            </div>
            <p className="text-xl font-display font-bold">Payment absolute success!</p>
          </div>
        )}

        <h2 className="text-2xl font-display font-bold text-coffee-dark mb-1">Checkout</h2>
        <p className="text-sm text-stone-500 mb-6">Complete your order securely.</p>

        <div className="bg-cream-dark/50 rounded-xl p-4 mb-6 text-center">
          <p className="text-sm text-stone-600">Amount Due</p>
          <p className="text-4xl font-black text-coffee mt-1">₹{total}</p>
        </div>

        <form onSubmit={handlePayment} className="space-y-4">
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">Card Number</span>
            <input 
              required
              type="text" 
              maxLength="19"
              placeholder="0000 0000 0000 0000"
              className="mt-1 w-full rounded-xl border border-stone-200 px-4 py-3 font-mono text-sm outline-none focus:border-coffee"
            />
          </label>
          <div className="flex gap-4">
            <label className="block flex-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">Expiry</span>
              <input 
                required
                type="text" 
                placeholder="MM/YY"
                maxLength="5"
                className="mt-1 w-full rounded-xl border border-stone-200 px-4 py-3 font-mono text-sm outline-none focus:border-coffee"
              />
            </label>
            <label className="block flex-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">CVC</span>
              <input 
                required
                type="text" 
                placeholder="123"
                maxLength="4"
                className="mt-1 w-full rounded-xl border border-stone-200 px-4 py-3 font-mono text-sm outline-none focus:border-coffee"
              />
            </label>
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              type="button" 
              onClick={onCancel}
              className="flex-1 rounded-full py-3 text-sm font-semibold text-stone-500 hover:bg-stone-100"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 rounded-full bg-coffee py-3 text-sm font-semibold text-white shadow-md hover:bg-coffee-light"
            >
              Pay Now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
