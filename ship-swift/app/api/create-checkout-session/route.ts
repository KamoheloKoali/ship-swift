// app/api/create-checkout-session/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Validate environment variable
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable');
}

// Initialize Stripe with proper typing
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2023-10-16', // Update to latest version
  typescript: true,
});

export async function POST(request: Request) {
  try {
    const { jobId, amount } = await request.json();

    if (!jobId || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Payment for Job #${jobId}`,
            },
            unit_amount: Math.round(parseFloat(amount) * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/cancel`,
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Stripe error:', error);
    return NextResponse.json(
      { error: 'Payment session creation failed' },
      { status: 500 }
    );
  }
}