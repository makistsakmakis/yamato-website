import { CheckCircle } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

export default function OrderSuccess() {
  const [params] = useSearchParams();
  const orderId  = params.get('order');

  return (
    <div className="min-h-screen bg-yamato-black pt-20 flex items-center justify-center">
      <div className="text-center max-w-md px-6 space-y-6">
        <CheckCircle className="w-16 h-16 text-green-400 mx-auto" />
        <h1 className="section-title text-white">ΕΥΧΑΡΙΣΤΟΥΜΕ!</h1>
        <p className="text-white/60 leading-relaxed">
          Η παραγγελία σου καταχωρήθηκε επιτυχώς.
          Θα λάβεις email επιβεβαίωσης σύντομα.
        </p>
        {orderId && (
          <p className="text-white/30 text-xs">
            Αρ. Παραγγελίας: #{orderId}
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Link to="/shop" className="btn-primary">
            Συνέχεια Αγορών
          </Link>
          <Link to="/" className="btn-secondary">
            Αρχική
          </Link>
        </div>
      </div>
    </div>
  );
}
