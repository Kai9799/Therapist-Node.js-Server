import { Injectable } from '@nestjs/common';
import { stripeInstance } from 'src/config/stripe';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class BillingService {
    private readonly appUrl: string;

    constructor() {
        this.appUrl = process.env.APP_URL!;
    }

    async createCheckoutSession(priceId: string) {
        const session = await stripeInstance.checkout.sessions.create({
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [{ price: priceId, quantity: 1 }],
            subscription_data: {
                trial_period_days: 14,
            },
            success_url: `${this.appUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${this.appUrl}/cancel`,
        });

        return { url: session.url };
    }

    async handleWebhook(body: Buffer, sig: string) {
        const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

        const event = stripeInstance.webhooks.constructEvent(body, sig, endpointSecret);

        switch (event.type) {
            case 'checkout.session.completed':
                break;
        }
    }
}
