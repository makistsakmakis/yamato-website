import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, ChevronLeft, Package } from 'lucide-react';
import { getProduct, getAvailability } from '../../lib/supabase';
import { useCart } from '../../context/CartContext';

const AVAILABILITY_STYLES = {
  available:   { dot: 'bg-green-400',  text: 'text-green-400'  },
  limited:     { dot: 'bg-orange-300', text: 'text-orange-300' },
  unavailable: { dot: 'bg-white/20',   text: 'text-white/40'   },
};

export default function ProductPage() {
  const { id } = useParams();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProduct(Number(id))
      .then(setProduct)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-yamato-black pt-20 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-yamato-red border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-yamato-black pt-20 flex flex-col items-center justify-center gap-4">
        <p className="text-white/50">Το προϊόν δεν βρέθηκε.</p>
        <Link to="/shop" className="btn-secondary">← Επιστροφή στο Shop</Link>
      </div>
    );
  }

  const avail = getAvailability(product.stock);
  const canBuy = avail.status !== 'unavailable';
  const availStyle = AVAILABILITY_STYLES[avail.status];

  return (
    <div className="min-h-screen bg-yamato-black pt-20">
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Breadcrumb */}
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-white/40 hover:text-yamato-red text-sm mb-8 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Επιστροφή στο Shop
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">

          {/* Image */}
          <div className="aspect-square card-dark overflow-hidden flex items-center justify-center">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name_gr}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-4 text-center p-8">
                <Package className="w-16 h-16 text-yamato-red/30" />
                <span className="text-white/20 text-sm uppercase tracking-widest">
                  {product.brand}
                </span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col gap-6">

            {/* Category + Brand */}
            <div className="flex flex-col gap-1">
              {product.category_name_gr && (
                <span className="section-subtitle">{product.category_name_gr}</span>
              )}
              {product.brand && (
                <span className="text-white/40 text-sm uppercase tracking-wider">
                  {product.brand}
                </span>
              )}
            </div>

            {/* Name */}
            <h1 className="section-title text-white leading-tight">
              {product.name_gr}
            </h1>

            {/* English name */}
            {product.name_en && product.name_en !== product.name_gr && (
              <p className="text-white/40 text-sm">{product.name_en}</p>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-white">
                €{Number(product.price).toFixed(2)}
              </span>
            </div>

            {/* Availability */}
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${availStyle.dot}`} />
              <span className={`text-sm font-medium ${availStyle.text}`}>
                {avail.label}
              </span>
            </div>

            {/* Divider */}
            <div className="border-t border-white/10" />

            {/* Add to cart */}
            <button
              onClick={() => canBuy && addItem(product)}
              disabled={!canBuy}
              className={`btn-primary w-full justify-center gap-3 py-4 text-base ${
                !canBuy ? 'opacity-40 cursor-not-allowed' : ''
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
              {canBuy ? 'Προσθήκη στο Καλάθι' : 'Μη Διαθέσιμο'}
            </button>

            {/* SKU */}
            {product.sku && (
              <p className="text-white/20 text-xs">
                SKU: {product.sku}
                {product.ean ? ` · EAN: ${product.ean}` : ''}
              </p>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
