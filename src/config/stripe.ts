import Stripe from 'stripe';
import * as dotenv from 'dotenv';

dotenv.config();

export const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-04-30.basil',
});