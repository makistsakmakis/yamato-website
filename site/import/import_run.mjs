import 'dotenv/config';
import pkg from 'xlsx';
const { readFile, utils } = pkg;
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
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

const excelPath = process.env.EXCEL_PATH || './TOTAL_FILE_UPDATED_ERP_UPLOAD_FIXED_2.xlsx';
const wb = readFile(excelPath);
const ws = wb.Sheets[wb.SheetNames[0]];
const rows = utils.sheet_to_json(ws, { defval: null });
console.log(`📊 ${rows.length} γραμμές από Sheet1`);

// Μοναδικές κατηγορίες από ΟΛΑ τα προϊόντα
const uniqueCategories = [...new Set(rows.map(r => r['Category_HIERARCHY']).filter(Boolean))];
console.log(`📁 Κατηγορίες: ${uniqueCategories.length}`);

async function importCategories() {
  const categoryData = uniqueCategories.map(name => ({ slug: slugify(name), name_gr: name, name_en: name }));
  const { data, error } = await supabase.from('categories').upsert(categoryData, { onConflict: 'slug' }).select();
  if (error) throw new Error(`Categories: ${error.message}`);
  console.log(`✅ ${data.length} κατηγορίες`);
  return Object.fromEntries(data.map(c => [c.name_gr, c.id]));
}

async function importProducts(categoryMap) {
  const toInsert = rows.map(r => {
    const isRetail       = r['RETAIL'] == 1 && r['PRIZE'] != 1;
    const isPrize        = r['PRIZE'] == 1;
    const isFeaturedPr   = r['PRIZE'] == 1 && r['FEATURED_PR'] == 1;
    const isFeaturedRet  = r['FEATURED_RET'] == 1;

    return {
      sku:                r['SUPPLIER_ITEM_CODE_PART_NUMBER'],
      ean:                String(r['BARCODE_EAN'] ?? ''),
      name_gr:            r['DESCRIPTION-GR'],
      name_en:            r['DESCRIPTION-EN'],
      category_id:        categoryMap[r['Category_HIERARCHY']] ?? null,
      brand:              r['BRAND'],
      price:              isPrize ? null : parseNum(r['SRP']),
      stock:              parseStock(r['STOCK']),
      is_retail:          isRetail,
      is_prize:           isPrize,
      is_featured_prize:  isFeaturedPr,
      is_featured_retail: isFeaturedRet,
      hero_tag:           r['HERO'] || null,
      image_url:          null,
      active:             r['INACTIVE'] != 1,
    };
  });

  const BATCH = 50;
  let inserted = 0;
  for (let i = 0; i < toInsert.length; i += BATCH) {
    const { error } = await supabase.from('products').insert(toInsert.slice(i, i + BATCH));
    if (error) throw new Error(`Products batch ${i}: ${error.message}`);
    inserted += Math.min(BATCH, toInsert.length - i);
    process.stdout.write(`\r  → ${inserted}/${toInsert.length}`);
  }
  console.log(`\n✅ ${inserted} προϊόντα (${toInsert.filter(p=>p.is_retail).length} retail, ${toInsert.filter(p=>p.is_featured_prize).length} prize featured, ${toInsert.filter(p=>!p.is_retail&&!p.is_prize).length} hidden)`);
}

async function main() {
  console.log('\n🚀 Import ALL products...\n');
  try {
    // Καθάρισμα παλιών δεδομένων
    await supabase.from('products').delete().neq('id', 0);
    await supabase.from('categories').delete().neq('id', 0);
    console.log('🗑️  Παλιά δεδομένα διαγράφηκαν');

    const categoryMap = await importCategories();
    await importProducts(categoryMap);
    console.log('\n🎉 Ολοκληρώθηκε!\n');
  } catch (err) {
    console.error('\n❌', err.message);
    process.exit(1);
  }
}
main();
