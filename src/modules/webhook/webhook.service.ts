import { Injectable } from '@nestjs/common';
import * as stripe from 'stripe';
import { stripeInstance } from 'src/config/stripe';
import { ClerkService } from '../clerk/clerk.service';

@Injectable()
export class WebhookService {
    private stripeClient: stripe.Stripe;

    constructor(private readonly clerkService: ClerkService) {
        this.stripeClient = stripeInstance;
    }

    async verifyWebhookSignature(payload: any, signature: string, secret: string): Promise<any> {
        try {
            return this.stripeClient.webhooks.constructEvent(
                JSON.stringify(payload),
                signature,
                secret
            );
        } catch (error) {
            throw new Error('Webhook signature verification failed');
        }
    }

    async handleEvent(event: any): Promise<void> {
        switch (event.type) {
            case 'checkout.session.completed':
                await this.handleCheckoutSessionCompleted(event);
                break;
            case 'invoice.payment_succeeded':
                await this.handleInvoicePaymentSucceeded(event);
                break;
            case 'customer.subscription.created':
                await this.handleSubscriptionCreated(event);
                break;
            default:
                console.log(`Unhandled event type: ${event.type}`);
        }
    }

    private async handleCheckoutSessionCompleted(event: any): Promise<void> {
        const session = event.data.object;
        const subscription = await this.stripeClient.subscriptions.retrieve(session.subscription as string);
        const customer = await this.stripeClient.customers.retrieve(session.customer as string);

        await this.clerkService.updateUserMetadata(session.client_reference_id, {
            stripeCustomerId: customer.id,
            stripeSubscriptionId: subscription.id,
            subscriptionStatus: subscription.status,
        });

        console.log('Successfully synced checkout session with Clerk');
    }

    private async handleInvoicePaymentSucceeded(event: any): Promise<void> {
        const invoice = event.data.object;
        console.log(`Invoice ${invoice.id} payment succeeded`);
    }

    private async handleSubscriptionCreated(event: any): Promise<void> {
        const subscription = event.data.object;
        console.log(`Subscription ${subscription.id} created`);
    }
}
