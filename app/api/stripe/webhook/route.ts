import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;

      console.log('✅ Checkout completed:', {
        id: session.id,
        customer_email: session.customer_email,
        amount_total: session.amount_total,
      });

      // TODO: Create transaction record in Supabase
      // TODO: Trigger onboarding automation via n8n webhook
      // TODO: Send welcome email
      // TODO: Post to Slack #builds-keith

      break;
    }

    case 'customer.subscription.created': {
      const subscription = event.data.object as Stripe.Subscription;
      console.log('🔄 Subscription created:', subscription.id);
      break;
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      console.log('🔄 Subscription updated:', subscription.id, subscription.status);
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      console.log('❌ Subscription cancelled:', subscription.id);
      // TODO: Handle churn - notify Jin
      break;
    }

    case 'invoice.paid': {
      const invoice = event.data.object as Stripe.Invoice;
      console.log('💰 Invoice paid:', invoice.id, invoice.amount_paid);
      // TODO: Update revenue in dashboard
      // TODO: Attribute to agent (Alen for new, Elena for renewal)
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      console.log('⚠️ Payment failed:', invoice.id);
      // TODO: Trigger Elena to send payment reminder
      break;
    }

    case 'charge.refunded': {
      const charge = event.data.object as Stripe.Charge;
      console.log('💸 Refund processed:', charge.id, charge.amount_refunded);
      // TODO: Update transaction status
      // TODO: Log to #support-elena
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

// Disable body parsing for webhook signature verification
export const config = {
  api: {
    bodyParser: false,
  },
};
