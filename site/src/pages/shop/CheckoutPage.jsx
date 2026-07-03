import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useLang } from '../../context/LanguageContext';

// ── Payment config (interim: no card payments yet) ────────────
const COD_FEE = 3;                                     // αντικαταβολή surcharge
const BANK_IBAN = 'GRXX XXXX XXXX XXXX XXXX XXXX XXX';  // TODO: replace with real IBAN
const BANK_NAME = '';                                   // TODO: beneficiary / bank (optional)
const ORDER_EMAIL = 'info@germ.gr';

function CheckoutForm() {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const { t, lang } = useLang();
  const c = t.checkout;

  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    address: '', city: '', postal: '',
  });
  const [payment, setPayment] = useState('cod');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const handleChange = e =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const fee = payment === 'cod' ? COD_FEE : 0;
  const grandTotal = totalPrice + fee;

  const nameForLang = (item) => (lang === 'el' ? (item.name_gr || item.name_en) : (item.name_en || item.name_gr)) || item.name_gr;

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const ref = 'YA-' + Date.now().toString().slice(-8);
      const lines = items
        .map(i => `- ${nameForLang(i)} x ${i.quantity} = €${(i.price * i.quantity).toFixed(2)}`)
        .join('\n');
      const paymentLabel = payment === 'cod'
        ? `${c.emCod} (+€${COD_FEE})`
        : `${c.emBank} — IBAN: ${BANK_IBAN}${BANK_NAME ? ` (${BANK_NAME})` : ''}`;
      const body =
`${c.emTitle} (${ref})

${c.emCustomer}: ${form.name}
${c.f_email}: ${form.email}
${c.f_phone}: ${form.phone}
${c.emAddress}: ${form.address}, ${form.city} ${form.postal}

${c.emPayment}: ${paymentLabel}

${c.emItems}:
${lines}

${c.subtotal}: €${totalPrice.toFixed(2)}
${fee ? `${c.emCod}: €${fee.toFixed(2)}\n` : ''}${c.total}: €${grandTotal.toFixed(2)}`;
      const mailto = `mailto:${ORDER_EMAIL}?subject=${encodeURIComponent(`[YAMATO] ${c.emOrderSubject} ${ref}`)}&body=${encodeURIComponent(body)}`;
      clearCart();
      window.location.href = mailto;
      navigate(`/checkout/success?order=${ref}`);
    } catch (err) {
      console.error(err);
      setError(t.forms?.error || 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-20 text-white/40">
        <p>{c.empty}</p>
      </div>
    );
  }

  const fields = [
    { name: 'name',    label: c.f_name,    type: 'text' },
    { name: 'email',   label: c.f_email,   type: 'email' },
    { name: 'phone',   label: c.f_phone,   type: 'tel' },
    { name: 'address', label: c.f_address, type: 'text' },
    { name: 'city',    label: c.f_city,    type: 'text' },
    { name: 'postal',  label: c.f_postal,  type: 'text' },
  ];

  return (
    <form onSubmit={handleSubmit} className="grid lg:grid-cols-2 gap-10">

      {/* Left */}
      <div className="space-y-6">
        <div>
          <p className="section-subtitle mb-4">{c.shipping}</p>
          <div className="space-y-3">
            {fields.map(f => (
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
          <p className="section-subtitle mb-4">{c.payment}</p>
          <div className="bg-yamato-red/10 border border-yamato-red/30 text-white/70 text-xs px-4 py-3 rounded-sm mb-4">
            {c.noCard}
          </div>
          <div className="space-y-3">
            <label className={`flex items-start gap-3 p-4 border rounded-sm cursor-pointer transition-colors ${payment === 'cod' ? 'border-yamato-red bg-yamato-red/5' : 'border-white/10 hover:border-white/30'}`}>
              <input type="radio" name="payment" value="cod" checked={payment === 'cod'} onChange={() => setPayment('cod')} className="mt-1 accent-yamato-red" />
              <span>
                <span className="block text-white font-bold text-sm">{c.codTitle} <span className="text-yamato-red">(+€{COD_FEE})</span></span>
                <span className="block text-white/40 text-xs mt-0.5">{c.codDesc}</span>
              </span>
            </label>

            <label className={`flex items-start gap-3 p-4 border rounded-sm cursor-pointer transition-colors ${payment === 'bank' ? 'border-yamato-red bg-yamato-red/5' : 'border-white/10 hover:border-white/30'}`}>
              <input type="radio" name="payment" value="bank" checked={payment === 'bank'} onChange={() => setPayment('bank')} className="mt-1 accent-yamato-red" />
              <span>
                <span className="block text-white font-bold text-sm">{c.bankTitle}</span>
                <span className="block text-white/40 text-xs mt-0.5">{c.bankDesc}</span>
                {payment === 'bank' && (
                  <span className="block mt-2 text-white/70 text-xs font-mono bg-yamato-gray-mid px-3 py-2 rounded-sm break-all">
                    IBAN: {BANK_IBAN}{BANK_NAME ? ` · ${BANK_NAME}` : ''}
                  </span>
                )}
              </span>
            </label>
          </div>
        </div>

        {error && (
          <p className="text-yamato-red text-sm bg-yamato-red/10 border border-yamato-red/30 px-4 py-3 rounded-sm">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full justify-center py-4 text-base disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? c.processing : `${c.submit} — €${grandTotal.toFixed(2)}`}
        </button>
        <p className="text-white/30 text-[11px] text-center">{c.note}</p>
      </div>

      {/* Right: Summary */}
      <div className="card-dark p-6 space-y-4 h-fit">
        <p className="section-subtitle">{c.summary}</p>
        {items.map(item => (
          <div key={item.id} className="flex justify-between text-sm">
            <span className="text-white/70 line-clamp-1 flex-1 pr-4">
              {nameForLang(item)} × {item.quantity}
            </span>
            <span className="text-white font-semibold shrink-0">
              €{(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
        <div className="border-t border-white/10 pt-4 space-y-2">
          <div className="flex justify-between text-sm text-white/60">
            <span>{c.subtotal}</span>
            <span>€{totalPrice.toFixed(2)}</span>
          </div>
          {fee > 0 && (
            <div className="flex justify-between text-sm text-white/60">
              <span>{c.codFeeRow}</span>
              <span>€{fee.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between font-black text-lg pt-2">
            <span className="text-white">{c.total}</span>
            <span className="text-yamato-red">€{grandTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

    </form>
  );
}

export default function CheckoutPage() {
  const { t } = useLang();
  const c = t.checkout;
  return (
    <div className="min-h-screen bg-yamato-black pt-20">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <p className="section-subtitle">{c.store}</p>
        <h1 className="section-title text-white mb-10">{c.title}</h1>
        <CheckoutForm />
      </div>
    </div>
  );
}
