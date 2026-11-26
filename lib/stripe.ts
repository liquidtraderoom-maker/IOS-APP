import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
});

export async function createPaymentLink(options: {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
}) {
  const link = await stripe.paymentLinks.create({
    line_items: [{ price: options.priceId, quantity: 1 }],
    after_completion: {
      type: 'redirect',
      redirect: { url: options.successUrl },
    },
  });
  return link;
}

export async function createCheckoutSession(options: {
  priceId: string;
  customerEmail: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}) {
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    customer_email: options.customerEmail,
    line_items: [{ price: options.priceId, quantity: 1 }],
    success_url: options.successUrl,
    cancel_url: options.cancelUrl,
    metadata: options.metadata,
  });
  return session;
}

export async function createCustomerPortalSession(customerId: string, returnUrl: string) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });
  return session;
}
