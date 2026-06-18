/**
 * YAMATO E-SHOP — Product Import Script
 * Διαβάζει το Sheet1 του Excel και γεμίζει τη Supabase βάση.
 *
 * Χρήση:
 *   npm install @supabase/supabase-js xlsx dotenv
 *   node import_products.js
 *
 * .env:
 *   SUPABASE_URL=https://xxxx.supabase.co
 *   SUPABASE_SERVICE_KEY=eyJ...   ← service_role key (όχι anon)
 *   EXCEL_PATH=../TOTAL_FILE_UPDATED_ERP_UPLOAD_FIXED_2.xlsx
 */

import 'dotenv/config';
import * as XLSX from 'xlsx';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// ── Βοηθητικές ──────────────────────────────────────────────

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function parseNum(val) {
  if (val === null || val === undefined || val === '') return null;
  const n = parseFloat(String(val).replace(',', '.'));
  return isNaN(n) ? null : n;
}

function parseStock(val) {
  const n = parseInt(val);
  return isNaN(n) ? 0 : n;
}

// ── Διαβάζουμε το Excel (Sheet1 μόνο) ───────────────────────

const excelPath = process.env.EXCEL_PATH || './products.xlsx';
const wb = XLSX.readFile(excelPath);
const ws = wb.Sheets[wb.SheetNames[0]]; // Sheet1 μόνο
const rows = XLSX.utils.sheet_to_json(ws, { defval: null });

console.log(`📊 Διαβάστηκαν ${rows.length} γραμμές από το Sheet1`);

// ── Φιλτράρισμα βάσει business logic ────────────────────────

const retailProducts = rows.filter(r =>
  r['RETAIL'] == 1 && r['PRIZE'] != 1
);

const prizeProducts = rows.filter(r =>
  r['PRIZE'] == 1 && r['FEATURED_PR'] == 1
);

console.log(`🛒 Retail products: ${retailProducts.length}`);
console.log(`🎁 Prize featured products: ${prizeProducts.length}`);

// ── Συγκέντρωση μοναδικών κατηγοριών ────────────────────────

const allProducts = [...retailProducts, ...prizeProducts];
const uniqueCategories = [...new Set(
  allProducts.map(r => r['Category_HIERARCHY']).filter(Boolean)
)];

console.log(`📁 Κατηγορίες: ${uniqueCategories.length}`);

// ── Import κατηγοριών ────────────────────────────────────────

async function importCategories() {
  const categoryData = uniqueCategories.map(name => ({
    slug: slugify(name),
    name_gr: name,
    name_en: name, // μπορείς να το αλλάξεις αργότερα
  }));

  const { data, error } = await supabase
    .from('categories')
    .upsert(categoryData, { onConflict: 'slug' })
    .select();

  if (error) throw new Error(`Categories error: ${error.message}`);
  console.log(`✅ ${data.length} κατηγορίες εισήχθησαν`);

  // Επιστρέφουμε map: name → id
  return Object.fromEntries(data.map(c => [c.name_gr, c.id]));
}

// ── Import προϊόντων ─────────────────────────────────────────

async function importProducts(categoryMap) {
  const toInsert = [];

  // Retail products
  for (const r of retailProducts) {
    toInsert.push({
      sku:                r['SUPPLIER_ITEM_CODE_PART_NUMBER'],
      ean:                String(r['BARCODE_EAN'] ?? ''),
      name_gr:            r['DESCRIPTION-GR'],
      name_en:            r['DESCRIPTION-EN'],
      category_id:        categoryMap[r['Category_HIERARCHY']] ?? null,
      brand:              r['BRAND'],
      price:              parseNum(r['SRP']),
      stock:              parseStock(r['STOCK']),
      is_retail:          true,
      is_prize:           false,
      is_featured_prize:  false,
      is_featured_retail: r['FEATURED_RET'] == 1,
      hero_tag:           r['HERO'] || null,
      image_url:          null,
      active:             r['INACTIVE'] != 1,
    });
  }

  // Prize featured products
  for (const r of prizeProducts) {
    toInsert.push({
      sku:                r['SUPPLIER_ITEM_CODE_PART_NUMBER'],
      ean:                String(r['BARCODE_EAN'] ?? ''),
      name_gr:            r['DESCRIPTION-GR'],
      name_en:            r['DESCRIPTION-EN'],
      category_id:        categoryMap[r['Category_HIERARCHY']] ?? null,
      brand:              r['BRAND'],
      price:              null,  // χωρίς τιμή τα prize items
      stock:              parseStock(r['STOCK']),
      is_retail:          false,
      is_prize:           true,
      is_featured_prize:  true,
      is_featured_retail: false,
      hero_tag:           r['HERO'] || null,
      image_url:          null,
      active:             r['INACTIVE'] != 1,
    });
  }

  // Batch insert (50 ανά φορά για ασφάλεια)
  const BATCH = 50;
  let inserted = 0;
  for (let i = 0; i < toInsert.length; i += BATCH) {
    const batch = toInsert.slice(i, i + BATCH);
    const { error } = await supabase.from('products').insert(batch);
    if (error) throw new Error(`Products batch error: ${error.message}`);
    inserted += batch.length;
    console.log(`  → ${inserted}/${toInsert.length} προϊόντα...`);
  }

  console.log(`✅ ${inserted} προϊόντα εισήχθησαν`);
}

// ── Main ─────────────────────────────────────────────────────

async function main() {
  console.log('\n🚀 Ξεκινά το import...\n');
  try {
    const categoryMap = await importCategories();
    await importProducts(categoryMap);
    console.log('\n🎉 Import ολοκληρώθηκε επιτυχώς!\n');
  } catch (err) {
    console.error('\n❌ Σφάλμα:', err.message);
    process.exit(1);
  }
}

main();
