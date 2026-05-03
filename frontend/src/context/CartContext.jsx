import { createContext, useContext, useMemo, useReducer } from 'react';

const CartContext = createContext(null);

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const id = action.item._id;
      const existing = state.items.find((i) => i._id === id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i._id === id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return { items: [...state.items, { ...action.item, quantity: 1 }] };
    }
    case 'REMOVE': {
      return { items: state.items.filter((i) => i._id !== action.id) };
    }
    case 'SET_QTY': {
      const q = Math.max(0, action.quantity);
      if (q === 0) {
        return { items: state.items.filter((i) => i._id !== action.id) };
      }
      return {
        items: state.items.map((i) =>
          i._id === action.id ? { ...i, quantity: q } : i
        ),
      };
    }
    case 'CLEAR':
      return { items: [] };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  const total = useMemo(
    () =>
      state.items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [state.items]
  );

  const value = useMemo(
    () => ({
      items: state.items,
      total,
      addItem: (item) => dispatch({ type: 'ADD', item }),
      removeItem: (id) => dispatch({ type: 'REMOVE', id }),
      setQuantity: (id, quantity) => dispatch({ type: 'SET_QTY', id, quantity }),
      clearCart: () => dispatch({ type: 'CLEAR' }),
    }),
    [state.items, total]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
