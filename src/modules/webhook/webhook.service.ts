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
            default:
                console.log(`Unhandled event type: ${event.type}`);
        }
    }

    private async handleCheckoutSessionCompleted(event: any): Promise<void> {
        const session = event.data.object;
        const subscription = await this.stripeClient.subscriptions.retrieve(session.subscription as string);
        const customer = await this.stripeClient.customers.retrieve(session.customer as string);

        console.log("customer", customer); //TODO delete
        await this.clerkService.updateUserMetadata(session.client_reference_id, {
            stripeCustomerId: customer.id,
            stripeSubscriptionId: subscription.id,
            subscriptionStatus: subscription.status,
        });

        console.log('Successfully synced checkout session with Clerk');
    }
}
