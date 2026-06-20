import { X, ShoppingBag, Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';

export default function CartDrawer() {
  const { items, drawerOpen, closeDrawer, removeItem, updateQty, totalItems, totalPrice } = useCart();

  return (
    <>
      {/* Backdrop */}
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-40 backdrop-blur-sm"
          onClick={closeDrawer}
        />
      )}

      {/* Drawer */}
      <div className={`
        fixed top-0 right-0 h-full w-full max-w-sm bg-yamato-dark border-l border-white/10
        z-50 flex flex-col transition-transform duration-300
        ${drawerOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-yamato-red" />
            <span className="font-bold uppercase tracking-widest text-sm">
              Καλάθι
            </span>
            {totalItems > 0 && (
              <span className="bg-yamato-red text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {totalItems}
              </span>
            )}
          </div>
          <button onClick={closeDrawer} className="text-white/50 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-white/30">
              <ShoppingBag className="w-12 h-12" />
              <p className="text-sm uppercase tracking-widest">Το καλάθι είναι άδειο</p>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="flex gap-3 bg-yamato-gray rounded-sm p-3">

                {/* Image / placeholder */}
                <div className="w-16 h-16 shrink-0 bg-yamato-gray-mid rounded-sm overflow-hidden flex items-center justify-center">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.name_gr} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-yamato-red/50 font-black text-lg">
                      {item.brand?.charAt(0) ?? '?'}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 flex flex-col gap-1">
                  <p className="text-sm font-semibold text-white line-clamp-2 leading-tight">
                    {item.name_gr}
                  </p>
                  <p className="text-white/40 text-xs">{item.brand}</p>
                  <p className="text-yamato-red font-bold text-sm">
                    €{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>

                {/* Controls */}
                <div className="flex flex-col items-end justify-between gap-2 shrink-0">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-white/30 hover:text-yamato-red transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQty(item.id, item.quantity - 1)}
                      className="w-6 h-6 flex items-center justify-center border border-white/20 hover:border-yamato-red text-white/60 hover:text-white transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQty(item.id, item.quantity + 1)}
                      className="w-6 h-6 flex items-center justify-center border border-white/20 hover:border-yamato-red text-white/60 hover:text-white transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-white/10 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-white/60 text-sm uppercase tracking-wider">Σύνολο</span>
              <span className="text-white font-black text-xl">€{totalPrice.toFixed(2)}</span>
            </div>
            <Link
              to="/checkout"
              onClick={closeDrawer}
              className="btn-primary w-full justify-center"
            >
              Ολοκλήρωση Παραγγελίας
            </Link>
            <button
              onClick={closeDrawer}
              className="btn-ghost w-full justify-center text-sm"
            >
              Συνέχεια Αγορών
            </button>
          </div>
        )}

      </div>
    </>
  );
}
