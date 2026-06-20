import { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext(null);

// ── Reducer ──────────────────────────────────────────────────

function cartReducer(state, action) {
  switch (action.type) {

    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.id === action.product.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.id === action.product.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.product, quantity: 1 }],
      };
    }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(i => i.id !== action.id),
      };

    case 'UPDATE_QUANTITY': {
      if (action.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(i => i.id !== action.id),
        };
      }
      return {
        ...state,
        items: state.items.map(i =>
          i.id === action.id ? { ...i, quantity: action.quantity } : i
        ),
      };
    }

    case 'CLEAR_CART':
      return { ...state, items: [] };

    case 'OPEN_DRAWER':
      return { ...state, drawerOpen: true };

    case 'CLOSE_DRAWER':
      return { ...state, drawerOpen: false };

    default:
      return state;
  }
}

const initialState = {
  items: [],
  drawerOpen: false,
};

// ── Provider ─────────────────────────────────────────────────

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState, (init) => {
    // Persist cart στο sessionStorage
    try {
      const saved = sessionStorage.getItem('yamato_cart');
      return saved ? { ...init, items: JSON.parse(saved) } : init;
    } catch {
      return init;
    }
  });

  // Save to sessionStorage on every change
  useEffect(() => {
    sessionStorage.setItem('yamato_cart', JSON.stringify(state.items));
  }, [state.items]);

  // ── Computed ──────────────────────────────────────────────

  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  // ── Actions ───────────────────────────────────────────────

  const addItem    = (product) => {
    dispatch({ type: 'ADD_ITEM', product });
    dispatch({ type: 'OPEN_DRAWER' });
  };
  const removeItem = (id)              => dispatch({ type: 'REMOVE_ITEM', id });
  const updateQty  = (id, quantity)    => dispatch({ type: 'UPDATE_QUANTITY', id, quantity });
  const clearCart  = ()                => dispatch({ type: 'CLEAR_CART' });
  const openDrawer = ()                => dispatch({ type: 'OPEN_DRAWER' });
  const closeDrawer= ()                => dispatch({ type: 'CLOSE_DRAWER' });

  return (
    <CartContext.Provider value={{
      items:       state.items,
      drawerOpen:  state.drawerOpen,
      totalItems,
      totalPrice,
      addItem,
      removeItem,
      updateQty,
      clearCart,
      openDrawer,
      closeDrawer,
    }}>
      {children}
    </CartContext.Provider>
  );
}

// ── Hook ─────────────────────────────────────────────────────

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
