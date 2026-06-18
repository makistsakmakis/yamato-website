/**
 * Vercel Serverless Function
 * POST /api/create-payment-intent
 *
 * Env vars needed (Vercel Dashboard → Settings → Environment Variables):
 *   STRIPE_SECRET_KEY        sk_live_... ή sk_test_...
 *   SUPABASE_URL             https://xxxx.supabase.co
 *   SUPABASE_SERVICE_KEY     eyJ...  (service_role)
 */

import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe    = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase  = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { amount, items, customer } = req.body;

    // Validation
    if (!amount || !items?.length || !customer?.email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // 1. Δημιουργία order στη Supabase
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        status:           'pending',
        total:            amount / 100,
        customer_email:   customer.email,
        customer_name:    customer.name,
        shipping_address: {
          line1:       customer.address,
          city:        customer.city,
          postal_code: customer.postal,
          country:     'GR',
        },
      })
      .select()
      .single();

    if (orderError) throw new Error(orderError.message);

    // 2. Δημιουργία order items
    const orderItems = items.map(item => ({
      order_id:          order.id,
      product_id:        item.id,
      quantity:          item.quantity,
      price_at_purchase: item.price,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw new Error(itemsError.message);

    // 3. Δημιουργία Stripe Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'eur',
      metadata: {
        order_id:       String(order.id),
        customer_email: customer.email,
      },
    });

    // 4. Αποθήκευση stripe payment intent id στο order
    await supabase
      .from('orders')
      .update({ stripe_payment_id: paymentIntent.id })
      .eq('id', order.id);

    return res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      orderId:      order.id,
    });

  } catch (err) {
    console.error('Payment intent error:', err);
    return res.status(500).json({ error: err.message });
  }
}
