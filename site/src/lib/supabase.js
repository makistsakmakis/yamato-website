import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export function getAvailability(stock) {
  if (stock > 5)  return { label: 'Διαθέσιμο',                  status: 'available'   };
  if (stock >= 1) return { label: 'Περιορισμένη διαθεσιμότητα',  status: 'limited'     };
  return            { label: 'Σε έλλειψη',                       status: 'unavailable' };
}

// ── Shop ─────────────────────────────────────────────────────────────────────

export async function getShopProducts(filters = {}) {
  if (!supabase) return [];
  let query = supabase.from('shop_products').select('*').order('name_gr');
  if (filters.category) query = query.eq('category', filters.category);
  if (filters.search)   query = query.ilike('name_gr', `%${filters.search}%`);
  const { data, error } = await query;
  if (error) { console.error(error); return []; }
  return data ?? [];
}

export async function getProduct(id) {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('shop_products').select('*').eq('id', id).single();
  if (error) { console.error(error); return null; }
  return data;
}

export async function getPrizeShowcase() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('prize_showcase').select('*').order('name_gr');
  if (error) { console.error(error); return []; }
  return data ?? [];
}

export async function getPrizeProducts(filters = {}) {
  if (!supabase) return [];
  let query = supabase
    .from('products')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false });
  if (filters.featured) query = query.eq('FEATURED_PR', true);
  if (filters.category) query = query.eq('category', filters.category);
  if (filters.search)   query = query.ilike('name_gr', `%${filters.search}%`);
  if (filters.limit)    query = query.limit(filters.limit);
  const { data, error } = await query;
  if (error) { console.error(error); return []; }
  return data ?? [];
}

export async function getShopCategories() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('shop_products')
    .select('category')
    .order('category');
  if (error) { console.error(error); return []; }
  const cats = [...new Set((data ?? []).map(r => r.category).filter(Boolean))];
  return cats;
}

// ── Profiles ──────────────────────────────────────────────────────────────────
// Schema: profiles.auth_user_id = auth.users.id (NOT profiles.id)

export async function getProfile(userId) {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('profiles').select('*').eq('auth_user_id', userId).single();
  if (error && error.code !== 'PGRST116') { console.error(error); return null; }
  return data ?? null;
}

export async function upsertProfile(userId, updates) {
  if (!supabase) return null;
  // Ensure auth session is current before writing
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Not authenticated — please sign in again');

  // Use atomic upsert — avoids UPDATE→INSERT race and RLS double-check issues
  const { data, error } = await supabase
    .from('profiles')
    .upsert(
      { auth_user_id: userId, ...updates, updated_at: new Date().toISOString() },
      { onConflict: 'auth_user_id' }
    )
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ── Club Membership ───────────────────────────────────────────────────────────
// Table: yamato_club_members (NOT club_memberships)

export async function getClubMembership(userId) {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('yamato_club_members')
    .select('*')
    .eq('auth_user_id', userId)
    .eq('membership_status', 'active')
    .single();
  if (error && error.code !== 'PGRST116') { console.error(error); return null; }
  return data ?? null;
}

export async function joinClub(userId, { marketingEmail = false, marketingSms = false } = {}) {
  if (!supabase) return null;
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('yamato_club_members')
    .insert({
      auth_user_id: userId,
      membership_status: 'active',
      member_since: now,
      club_terms_accepted_at: now,
      club_terms_version: '1.0',
      privacy_policy_accepted_at: now,
      privacy_policy_version: '1.0',
    })
    .select().single();
  if (error) throw error;
  return data;
}

export const createClubMembership = joinClub;

// ── Orders ────────────────────────────────────────────────────────────────────

export async function getOrders(userId) {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('orders').select('*').eq('auth_user_id', userId)
    .order('created_at', { ascending: false });
  if (error) { console.error(error); return []; }
  return data ?? [];
}

// ── Customer Addresses ────────────────────────────────────────────────────────

export async function getCustomerAddresses(userId) {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('customer_addresses').select('*').eq('auth_user_id', userId).order('created_at');
  if (error) { console.error(error); return []; }
  return data ?? [];
}

export async function upsertCustomerAddress(userId, address) {
  if (!supabase) return null;
  const payload = { auth_user_id: userId, ...address };
  const { data, error } = await supabase
    .from('customer_addresses').upsert(payload).select().single();
  if (error) throw error;
  return data;
}

export async function deleteCustomerAddress(addressId) {
  if (!supabase) return;
  const { error } = await supabase
    .from('customer_addresses').delete().eq('id', addressId);
  if (error) throw error;
}

// ── Marketing Consents ────────────────────────────────────────────────────────
// Schema: auth_user_id, consent_type, channel, status, accepted_at

export async function getMarketingConsents(userId) {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('marketing_consents').select('*').eq('auth_user_id', userId);
  if (error) { console.error(error); return []; }
  return data ?? [];
}

export async function upsertMarketingConsent(userId, { email_consent, sms_consent }) {
  if (!supabase) return;
  const now = new Date().toISOString();
  const rows = [
    {
      auth_user_id: userId,
      consent_type: 'marketing_news',
      channel: 'email',
      status: email_consent ? 'accepted' : 'withdrawn',
      accepted_at: email_consent ? now : null,
      source: 'website',
    },
    {
      auth_user_id: userId,
      consent_type: 'marketing_news',
      channel: 'sms',
      status: sms_consent ? 'accepted' : 'withdrawn',
      accepted_at: sms_consent ? now : null,
      source: 'website',
    },
  ];
  for (const row of rows) {
    const { error } = await supabase
      .from('marketing_consents')
      .upsert(row, { onConflict: 'auth_user_id,consent_type,channel' });
    if (error) throw error;
  }
}

// ── User Preferences ──────────────────────────────────────────────────────────
// Schema: auth_user_id, preference_type, preference_value

export async function getUserPreferences(userId) {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('user_preferences').select('*').eq('auth_user_id', userId);
  if (error) { console.error(error); return []; }
  return data ?? [];
}

export async function replaceUserPreferences(userId, type, values) {
  if (!supabase) return;
  await supabase.from('user_preferences').delete()
    .eq('auth_user_id', userId).eq('preference_type', type);
  if (!values || values.length === 0) return;
  const rows = values.map(v => ({
    auth_user_id: userId,
    preference_type: type,
    preference_value: v,
  }));
  const { error } = await supabase.from('user_preferences').insert(rows);
  if (error) throw error;
}

// ── Avatar Storage ────────────────────────────────────────────────────────────

export async function uploadAvatar(userId, file) {
  if (!supabase) return null;
  const ext = file.name.split('.').pop();
  const path = `${userId}/avatar.${ext}`;
  const { error } = await supabase.storage
    .from('avatars')
    .upload(path, file, { upsert: true, contentType: file.type });
  if (error) throw error;
  const { data } = supabase.storage.from('avatars').getPublicUrl(path);
  return data.publicUrl;
}

// ── Date formatting ───────────────────────────────────────────────────────────
// Uses browser regional settings (navigator.language) automatically

export function formatDate(dateStr, options = {}) {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat(navigator.language, {
    day: '2-digit', month: '2-digit', year: 'numeric',
    ...options,
  }).format(date);
}

export function formatMonth(dateStr) {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat(navigator.language, {
    year: 'numeric', month: 'long',
  }).format(date);
}
