import { ShoppingCart, AlertCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { getAvailability } from '../../lib/supabase';
import { Link } from 'react-router-dom';

const AVAILABILITY_STYLES = {
  available:   'text-green-400',
  limited:     'text-orange-300',
  unavailable: 'text-white/40',
};

const PLACEHOLDER_BG = 'bg-yamato-gray';

export default function ProductCard({ product, lang = 'en' }) {
  const { addItem } = useCart();
  const avail = getAvailability(product.stock);
  const canBuy = avail.status !== 'unavailable';
  const displayName = lang === 'el' ? (product.name_gr || product.name_en) : (product.name_en || product.name_gr);

  return (
    <div className="card-dark group flex flex-col hover:-translate-y-1 transition-all duration-300">

      {/* Image */}
      <Link to={`/shop/${product.id}`} className="block aspect-square overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={displayName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className={`w-full h-full ${PLACEHOLDER_BG} flex flex-col items-center justify-center gap-2`}>
            <span className="text-yamato-red/40 text-4xl font-black tracking-tighter">
              {product.brand?.charAt(0) ?? '?'}
            </span>
            <span className="text-white/20 text-xs uppercase tracking-widest">
              {product.brand}
            </span>
          </div>
        )}
      </Link>

      {/* Body */}
      <div className="flex flex-col flex-1 p-4 gap-3">

        {/* Category tag */}
        {product.category_name_gr && (
          <span className="section-subtitle text-[10px] mb-0">
            {product.category_name_gr}
          </span>
        )}

        {/* Name */}
        <Link to={`/shop/${product.id}`}>
          <h3 className="text-sm font-semibold text-white leading-tight line-clamp-2 hover:text-yamato-red transition-colors">
            {displayName}
          </h3>
        </Link>

        {/* Brand */}
        {product.brand && (
          <p className="text-white/40 text-xs uppercase tracking-wider">
            {product.brand}
          </p>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Price + Availability */}
        <div className="flex items-end justify-between gap-2">
          <div className="flex flex-col gap-1">
            <span className="text-white font-bold text-lg">
              €{Number(product.price).toFixed(2)}
            </span>
            <span className={`text-xs font-medium ${AVAILABILITY_STYLES[avail.status]}`}>
              {avail.label}
            </span>
          </div>

          {/* Add to cart */}
          <button
            onClick={() => canBuy && addItem(product)}
            disabled={!canBuy}
            className={`btn-primary p-3 ${!canBuy ? 'opacity-40 cursor-not-allowed' : ''}`}
            title={canBuy
              ? (lang === 'el' ? 'Προσθήκη στο καλάθι' : 'Add to cart')
              : (lang === 'el' ? 'Εξαντλήθηκε' : 'Out of stock')}
          >
            {canBuy
              ? <ShoppingCart className="w-4 h-4" />
              : <AlertCircle className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  )
}
