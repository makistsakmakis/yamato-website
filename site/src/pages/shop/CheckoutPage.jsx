import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useCart } from '../../context/CartContext';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '14px',
      color: '#f5f5f5',
      fontFamily: 'Inter, sans-serif',
      '::placeholder': { color: '#ffffff40' },
    },
    invalid: { color: '#E30613' },
  },
};

// ── Inner form (needs Stripe context) ────────────────────────

function CheckoutForm() {
  const stripe    = useStripe();
  const elements  = useElements();
  const navigate  = useNavigate();
  const { items, totalPrice, clearCart } = useCart();

  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    address: '', city: '', postal: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const handleChange = e =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    try {
      // 1. Δημιουργία payment intent από το Vercel serverless
      const res = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.round(totalPrice * 100), // cents
          items,
          customer: form,
        }),
      });

      if (!res.ok) throw new Error('Σφάλμα δημιουργίας παραγγελίας');
      const { clientSecret, orderId } = await res.json();

      // 2. Επιβεβαίωση πληρωμής με Stripe
      const { error: stripeError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: { name: form.name, email: form.email },
        },
      });

      if (stripeError) throw new Error(stripeError.message);

      // 3. Επιτυχία
      clearCart();
      navigate(`/checkout/success?order=${orderId}`);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-20 text-white/40">
        <p>Το καλάθι σου είναι άδειο.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid lg:grid-cols-2 gap-10">

      {/* Left: Στοιχεία */}
      <div className="space-y-6">

        <div>
          <p className="section-subtitle mb-4">Στοιχεία Αποστολής</p>
          <div className="space-y-3">
            {[
              { name: 'name',    label: 'Ονοματεπώνυμο', type: 'text' },
              { name: 'email',   label: 'Email',           type: 'email' },
              { name: 'phone',   label: 'Τηλέφωνο',        type: 'tel' },
              { name: 'address', label: 'Διεύθυνση',       type: 'text' },
              { name: 'city',    label: 'Πόλη',            type: 'text' },
              { name: 'postal',  label: 'Τ.Κ.',            type: 'text' },
            ].map(f => (
              <input
                key={f.name}
                type={f.type}
                name={f.name}
                placeholder={f.label}
                value={form[f.name]}
                onChange={handleChange}
                required
                className="form-input"
              />
            ))}
          </div>
        </div>

        <div>
          <p className="section-subtitle mb-4">Στοιχεία Κάρτας</p>
          <div className="form-input">
            <CardElement options={CARD_ELEMENT_OPTIONS} />
          </div>
        </div>

        {error && (
          <p className="text-yamato-red text-sm bg-yamato-red/10 border border-yamato-red/30 px-4 py-3 rounded-sm">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !stripe}
          className="btn-primary w-full justify-center py-4 text-base disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? 'Επεξεργασία...' : `Πληρωμή €${totalPrice.toFixed(2)}`}
        </button>
      </div>

      {/* Right: Σύνοψη */}
      <div className="card-dark p-6 space-y-4 h-fit">
        <p className="section-subtitle">Σύνοψη Παραγγελίας</p>
        {items.map(item => (
          <div key={item.id} className="flex justify-between text-sm">
            <span className="text-white/70 line-clamp-1 flex-1 pr-4">
              {item.name_gr} × {item.quantity}
            </span>
            <span className="text-white font-semibold shrink-0">
              €{(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
        <div className="border-t border-white/10 pt-4 flex justify-between font-black text-lg">
          <span className="text-white">Σύνολο</span>
          <span className="text-yamato-red">€{totalPrice.toFixed(2)}</span>
        </div>
      </div>

    </form>
  );
}

// ── Page wrapper ──────────────────────────────────────────────

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-yamato-black pt-20">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <p className="section-subtitle">YAMATO STORE</p>
        <h1 className="section-title text-white mb-10">CHECKOUT</h1>
        <Elements stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      </div>
    </div>
  );
}
