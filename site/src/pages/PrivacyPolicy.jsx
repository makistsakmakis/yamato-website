import { useState } from 'react'
import { useLang } from '../context/LanguageContext'

const LAST_UPDATED = '17 Ιουνίου 2026 / June 17, 2026'
const COMPANY      = 'YAMATO Urban Play'
const EMAIL        = 'privacy@yamato.gr'
const ADDRESS      = 'Αθήνα, Ελλάδα'
const DPA          = 'Αρχή Προστασίας Δεδομένων Προσωπικού Χαρακτήρα (ΑΠΔΠΧ) — www.dpa.gr'

// ── Section wrapper ───────────────────────────────────────────────────────────
function Section({ title, children }) {
  return (
    <div className="mb-10">
      <h2 className="text-white font-bold text-base uppercase tracking-wider mb-4 pb-2 border-b border-white/10">
        {title}
      </h2>
      <div className="text-white/60 text-sm leading-relaxed space-y-3">{children}</div>
    </div>
  )
}

function Ul({ items }) {
  return (
    <ul className="list-disc list-inside space-y-1 pl-2 text-white/60 text-sm">
      {items.map((item, i) => <li key={i}>{item}</li>)}
    </ul>
  )
}

// ── Greek version ─────────────────────────────────────────────────────────────
function PolicyEL() {
  return (
    <div>
      <Section title="1. Ποιοι Είμαστε">
        <p>
          Η <strong className="text-white">{COMPANY}</strong> («YAMATO», «εμείς») είναι υπεύθυνος επεξεργασίας
          των προσωπικών δεδομένων που συλλέγονται μέσω του παρόντος ιστότοπου και των υπηρεσιών μας.
        </p>
        <p>
          Επικοινωνία: <a href={`mailto:${EMAIL}`} className="text-yamato-red hover:underline">{EMAIL}</a>
          <br />{ADDRESS}
        </p>
      </Section>

      <Section title="2. Ποια Δεδομένα Συλλέγουμε">
        <p>Συλλέγουμε τα παρακάτω κατηγορίες δεδομένων:</p>
        <Ul items={[
          'Στοιχεία ταυτοποίησης: όνομα, επώνυμο, ημερομηνία γέννησης',
          'Στοιχεία επικοινωνίας: email, τηλέφωνο',
          'Δεδομένα λογαριασμού: ιστορικό παραγγελιών, προτιμήσεις, διευθύνσεις',
          'Δεδομένα μέλους YAMATO Club: αριθμός μέλους, ημερομηνία εγγραφής',
          'Δεδομένα εμπορικής επικοινωνίας: συγκαταθέσεις email/SMS',
          'Τεχνικά δεδομένα: διεύθυνση IP, cookies, δεδομένα περιήγησης',
        ]} />
      </Section>

      <Section title="3. Νομική Βάση Επεξεργασίας">
        <p>Επεξεργαζόμαστε τα δεδομένα σας βάσει:</p>
        <Ul items={[
          'Συγκατάθεσης (άρθρο 6§1α ΓΚΠΔ) — για εμπορικές επικοινωνίες και μη-απαραίτητα cookies',
          'Εκτέλεσης σύμβασης (άρθρο 6§1β) — για τη λειτουργία λογαριασμού και παραγγελιών',
          'Έννομου συμφέροντος (άρθρο 6§1στ) — για ασφάλεια, ανάλυση χρήσης και βελτίωση υπηρεσιών',
          'Νομικής υποχρέωσης (άρθρο 6§1γ) — για συμμόρφωση με φορολογική/λογιστική νομοθεσία',
        ]} />
      </Section>

      <Section title="4. Πώς Χρησιμοποιούμε τα Δεδομένα">
        <Ul items={[
          'Δημιουργία και διαχείριση λογαριασμού χρήστη',
          'Παροχή υπηρεσιών YAMATO Club (αριθμός μέλους, παροχές)',
          'Επεξεργασία παραγγελιών και αποστολή (Phase 2)',
          'Αποστολή ενημερωτικών email/SMS εφόσον έχετε συναινέσει',
          'Ανάλυση χρήσης για βελτίωση του ιστότοπου',
          'Συμμόρφωση με νομικές υποχρεώσεις',
        ]} />
      </Section>

      <Section title="5. Κοινοποίηση Δεδομένων σε Τρίτους">
        <p>Δεν πωλούμε τα δεδομένα σας. Μπορεί να τα μοιραστούμε με:</p>
        <Ul items={[
          'Παρόχους υποδομής cloud (Supabase — αποθήκευση δεδομένων, ΕΕ/ΗΠΑ με Standard Contractual Clauses)',
          'Παρόχους πληρωμών Stripe (Phase 2) — συμμορφούμενους με PCI-DSS',
          'Υπηρεσίες ανάλυσης (Google Analytics — ανωνυμοποιημένα δεδομένα)',
          'Αρχές επιβολής νόμου όταν απαιτείται από τη νομοθεσία',
        ]} />
      </Section>

      <Section title="6. Διαβίβαση Δεδομένων Εκτός ΕΕ">
        <p>
          Ορισμένοι πάροχοί μας (π.χ. Supabase) ενδέχεται να επεξεργάζονται δεδομένα εκτός ΕΟΧ.
          Διασφαλίζουμε κατάλληλες εγγυήσεις μέσω Τυπικών Συμβατικών Ρητρών (SCCs) σύμφωνα με
          τον ΓΚΠΔ.
        </p>
      </Section>

      <Section title="7. Χρόνος Διατήρησης Δεδομένων">
        <Ul items={[
          'Δεδομένα λογαριασμού: για όσο ο λογαριασμός παραμένει ενεργός + 3 χρόνια μετά τη διαγραφή',
          'Συγκαταθέσεις εμπορικής επικοινωνίας: έως ανάκληση + 5 χρόνια για αποδεικτικούς σκοπούς',
          'Παραγγελίες: 10 χρόνια (φορολογική νομοθεσία)',
          'Cookies τρίτων: βάσει πολιτικής εκάστου παρόχου',
        ]} />
      </Section>

      <Section title="8. Τα Δικαιώματά Σας (ΓΚΠΔ άρθρα 15–22)">
        <p>Έχετε δικαίωμα:</p>
        <Ul items={[
          'Πρόσβασης στα δεδομένα σας (άρθρο 15)',
          'Διόρθωσης ανακριβών δεδομένων (άρθρο 16)',
          'Διαγραφής («δικαίωμα λήθης») (άρθρο 17)',
          'Περιορισμού της επεξεργασίας (άρθρο 18)',
          'Φορητότητας δεδομένων σε μηχαναγνώσιμη μορφή (άρθρο 20)',
          'Εναντίωσης στην επεξεργασία (άρθρο 21)',
          'Ανάκλησης συγκατάθεσης ανά πάσα στιγμή χωρίς αναδρομικές συνέπειες (άρθρο 7§3)',
        ]} />
        <p>
          Ασκήστε τα δικαιώματά σας αποστέλλοντας email στο{' '}
          <a href={`mailto:${EMAIL}`} className="text-yamato-red hover:underline">{EMAIL}</a>.
          Θα απαντήσουμε εντός 30 ημερών.
        </p>
        <p>
          Έχετε επίσης δικαίωμα καταγγελίας στην:{' '}
          <strong className="text-white/80">{DPA}</strong>
        </p>
      </Section>

      <Section title="9. Cookies">
        <p>Χρησιμοποιούμε:</p>
        <Ul items={[
          'Απαραίτητα cookies — για σύνδεση και λειτουργία του ιστότοπου (δεν απαιτούν συγκατάθεση)',
          'Αναλυτικά cookies — Google Analytics (απαιτούν συγκατάθεση)',
          'Cookies marketing — Meta Pixel, TikTok Pixel (απαιτούν συγκατάθεση)',
        ]} />
        <p>Μπορείτε να διαχειριστείτε τις προτιμήσεις σας μέσω του banner cookies κατά την πρώτη επίσκεψη.</p>
      </Section>

      <Section title="10. Ασφάλεια">
        <p>
          Εφαρμόζουμε κρυπτογράφηση TLS σε μεταφορά, Row Level Security στη βάση δεδομένων,
          αυθεντικοποίηση χωρίς αποθήκευση κωδικών (email OTP μόνο) και περιορισμένη πρόσβαση
          εργαζομένων σε προσωπικά δεδομένα.
        </p>
      </Section>

      <Section title="11. Παιδιά">
        <p>
          Οι υπηρεσίες μας απευθύνονται σε άτομα άνω των 16 ετών. Δεν συλλέγουμε εσκεμμένα
          δεδομένα ανηλίκων κάτω των 16. Εάν διαπιστώσετε τέτοιο περιστατικό, επικοινωνήστε μαζί μας.
        </p>
      </Section>

      <Section title="12. Αλλαγές στην Πολιτική">
        <p>
          Ενδέχεται να αναθεωρούμε την παρούσα Πολιτική περιοδικά. Ουσιώδεις αλλαγές θα
          γνωστοποιούνται μέσω email ή ειδοποίησης στον ιστότοπο. Η συνέχιση χρήσης μετά από
          αλλαγές αποτελεί αποδοχή τους.
        </p>
      </Section>
    </div>
  )
}

// ── English version ───────────────────────────────────────────────────────────
function PolicyEN() {
  return (
    <div>
      <Section title="1. Who We Are">
        <p>
          <strong className="text-white">{COMPANY}</strong> ("YAMATO", "we") is the data controller for
          personal data collected through this website and our services.
        </p>
        <p>
          Contact: <a href={`mailto:${EMAIL}`} className="text-yamato-red hover:underline">{EMAIL}</a>
          <br />{ADDRESS}, Greece
        </p>
      </Section>

      <Section title="2. Data We Collect">
        <p>We collect the following categories of data:</p>
        <Ul items={[
          'Identity data: first name, last name, date of birth',
          'Contact data: email address, phone number',
          'Account data: order history, preferences, delivery addresses',
          'YAMATO Club data: member number, membership date, tier',
          'Marketing consent data: email/SMS opt-in records with timestamps',
          'Technical data: IP address, cookies, browsing behaviour',
        ]} />
      </Section>

      <Section title="3. Legal Basis for Processing">
        <p>We process your data on the following legal bases:</p>
        <Ul items={[
          'Consent (Art. 6(1)(a) GDPR) — for marketing communications and non-essential cookies',
          'Contract performance (Art. 6(1)(b)) — for account management and order fulfilment',
          'Legitimate interests (Art. 6(1)(f)) — for security, usage analytics and service improvement',
          'Legal obligation (Art. 6(1)(c)) — for tax and accounting compliance',
        ]} />
      </Section>

      <Section title="4. How We Use Your Data">
        <Ul items={[
          'Creating and managing your user account',
          'Providing YAMATO Club services (member number, benefits)',
          'Processing orders and shipping (Phase 2)',
          'Sending email/SMS communications where you have consented',
          'Usage analytics to improve the website',
          'Compliance with legal obligations',
        ]} />
      </Section>

      <Section title="5. Sharing Data with Third Parties">
        <p>We do not sell your data. We may share it with:</p>
        <Ul items={[
          'Cloud infrastructure providers (Supabase — data storage, EU/US with Standard Contractual Clauses)',
          'Payment providers Stripe (Phase 2) — PCI-DSS compliant',
          'Analytics services (Google Analytics — anonymised data)',
          'Law enforcement authorities when required by law',
        ]} />
      </Section>

      <Section title="6. International Transfers">
        <p>
          Some of our providers (e.g. Supabase) may process data outside the EEA.
          We ensure appropriate safeguards through Standard Contractual Clauses (SCCs)
          in accordance with GDPR.
        </p>
      </Section>

      <Section title="7. Data Retention">
        <Ul items={[
          'Account data: for as long as the account is active + 3 years after deletion',
          'Marketing consents: until withdrawal + 5 years for evidentiary purposes',
          'Orders: 10 years (tax law requirements)',
          "Third-party cookies: per each provider's own policy",
        ]} />
      </Section>

      <Section title="8. Your Rights (GDPR Articles 15–22)">
        <p>You have the right to:</p>
        <Ul items={[
          'Access your personal data (Art. 15)',
          'Rectification of inaccurate data (Art. 16)',
          'Erasure ("right to be forgotten") (Art. 17)',
          'Restriction of processing (Art. 18)',
          'Data portability in a machine-readable format (Art. 20)',
          'Object to processing (Art. 21)',
          'Withdraw consent at any time without retroactive effect (Art. 7(3))',
        ]} />
        <p>
          Exercise your rights by emailing{' '}
          <a href={`mailto:${EMAIL}`} className="text-yamato-red hover:underline">{EMAIL}</a>.
          We will respond within 30 days.
        </p>
        <p>
          You also have the right to lodge a complaint with the Greek supervisory authority:{' '}
          <strong className="text-white/80">{DPA}</strong>
        </p>
      </Section>

      <Section title="9. Cookies">
        <p>We use:</p>
        <Ul items={[
          'Essential cookies — for login and website function (no consent required)',
          'Analytics cookies — Google Analytics (consent required)',
          'Marketing cookies — Meta Pixel, TikTok Pixel (consent required)',
        ]} />
        <p>You can manage your preferences via the cookie banner on first visit.</p>
      </Section>

      <Section title="10. Security">
        <p>
          We implement TLS encryption in transit, Row Level Security on our database,
          password-free authentication (email OTP only), and restricted employee access
          to personal data.
        </p>
      </Section>

      <Section title="11. Children">
        <p>
          Our services are intended for users aged 16 and over. We do not knowingly collect
          data from children under 16. If you become aware of such an instance, please contact us.
        </p>
      </Section>

      <Section title="12. Changes to This Policy">
        <p>
          We may revise this Policy periodically. Material changes will be communicated
          via email or a notice on the website. Continued use after changes constitutes acceptance.
        </p>
      </Section>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function PrivacyPolicy() {
  const { lang } = useLang()
  const [view, setView] = useState(lang === 'el' ? 'el' : 'en')

  return (
    <div className="min-h-screen bg-yamato-black pt-20">
      <div className="max-w-3xl mx-auto px-4 py-12">

        {/* Header */}
        <div className="mb-10">
          <p className="section-subtitle mb-2">Legal</p>
          <h1 className="text-3xl font-black text-white">
            {view === 'el' ? 'Πολιτική Απορρήτου' : 'Privacy Policy'}
          </h1>
          <p className="text-white/30 text-xs mt-2">{LAST_UPDATED}</p>
        </div>

        {/* Language toggle */}
        <div className="flex gap-2 mb-10">
          {[['el','Ελληνικά'], ['en','English']].map(([l, label]) => (
            <button
              key={l}
              onClick={() => setView(l)}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-widest border transition-all ${
                view === l
                  ? 'border-yamato-red text-yamato-red bg-yamato-red/10'
                  : 'border-white/20 text-white/40 hover:border-white/40 hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Policy content */}
        {view === 'el' ? <PolicyEL /> : <PolicyEN />}

        {/* Footer note */}
        <div className="border-t border-white/10 pt-8 mt-8">
          <p className="text-white/20 text-xs">
            {view === 'el'
              ? `Για ερωτήσεις επικοινωνήστε: ${EMAIL}`
              : `For any queries contact: ${EMAIL}`}
          </p>
        </div>
      </div>
    </div>
  )
}
