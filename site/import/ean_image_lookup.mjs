/**
 * YAMATO — EAN Image Lookup
 * Κάνει lookup στο upcitemdb.com για κάθε προϊόν
 * και ενημερώνει το image_url στη Supabase.
 *
 * Χρήση: node ean_image_lookup.mjs
 */
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function lookupEAN(ean) {
  try {
    const clean = ean.replace(/^0+/, ''); // αφαίρεση leading zeros
    const res = await fetch(`https://api.upcitemdb.com/prod/trial/lookup?upc=${clean}`);
    if (!res.ok) return null;
    const data = await res.json();
    if (data.total > 0 && data.items[0].images?.length > 0) {
      // Προτιμάμε Target ή Walmart (καλή ποιότητα)
      const images = data.items[0].images;
      const preferred = images.find(u => u.includes('target.scene7') || u.includes('walmart')) || images[0];
      return preferred;
    }
  } catch {}
  return null;
}

async function main() {
  console.log('\n🔍 EAN Image Lookup για YAMATO products...\n');

  // Παίρνουμε όλα τα προϊόντα χωρίς εικόνα
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name_en, name_gr, ean, brand')
    .is('image_url', null)
    .not('ean', 'is', null)
    .neq('ean', '');

  if (error) { console.error('❌ Supabase error:', error.message); process.exit(1); }
  console.log(`📦 ${products.length} προϊόντα χωρίς εικόνα\n`);

  let found = 0, notFound = 0;

  for (const product of products) {
    process.stdout.write(`  [${product.brand}] ${(product.name_en || product.name_gr || '').slice(0, 50).padEnd(50)} → `);

    const imageUrl = await lookupEAN(product.ean);

    if (imageUrl) {
      await supabase.from('products').update({ image_url: imageUrl }).eq('id', product.id);
      console.log(`✅ ${imageUrl.slice(0, 60)}...`);
      found++;
    } else {
      console.log('❌ not found');
      notFound++;
    }

    // Rate limiting: 1 request ανά δευτερόλεπτο
    await sleep(1100);
  }

  console.log(`\n📊 Αποτέλεσμα: ${found} βρέθηκαν, ${notFound} δεν βρέθηκαν\n`);
  if (notFound > 0) {
    console.log('💡 Για τα υπόλοιπα θα χρειαστεί manual upload αργότερα.\n');
  }
}

main();
