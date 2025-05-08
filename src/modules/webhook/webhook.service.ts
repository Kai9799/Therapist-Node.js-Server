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

    async verifyWebhookSignature(payload: Buffer, signature: string, secret: string): Promise<any> {
        try {
            return this.stripeClient.webhooks.constructEvent(payload, signature, secret);
        } catch (error: any) {
            console.error('Webhook verification error:', error.message);
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
        const userId = session.client_reference_id;

        if (!userId) {
            console.error('Client reference ID is missing or invalid');
            return;
        }

        const formatDate = (timestamp: number): string =>
            new Date(timestamp * 1000).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
            });

        const metadata: Record<string, any> = {
            stripeCustomerId: customer.id,
            stripeSubscriptionId: subscription.id,
            subscriptionStatus: subscription.status,
        };

        if (subscription.trial_start && subscription.trial_end) {
            metadata.isOnTrial = true;
            metadata.trialStartedAt = formatDate(subscription.trial_start);
            metadata.trialEndsAt = formatDate(subscription.trial_end);
        } else {
            metadata.isOnTrial = false;
            metadata.currentPeriodStart = formatDate(subscription.start_date);
            metadata.planId = subscription.items.data[0]?.price.id;
            metadata.planAmount = subscription.items.data[0]?.price.unit_amount;
            metadata.planCurrency = subscription.items.data[0]?.price.currency;
        }

        try {
            await this.clerkService.updateUserMetadata(userId, metadata);
        } catch (error) {
            console.error('Failed to update Clerk metadata:', error);
        }
    }

}
