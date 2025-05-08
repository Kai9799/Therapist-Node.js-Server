import { Injectable } from '@nestjs/common';
import { clerkInstance } from 'src/config/clerk';

@Injectable()
export class ClerkService {
    private clerkClient = clerkInstance;

    async updateUserMetadata(userId: string, metadata: Record<string, any>) {
        try {
            return await this.clerkClient.users.updateUserMetadata(userId, {
                publicMetadata: metadata,
            });
        } catch (error) {
            console.error('Clerk API Error:', error);
            throw new Error('Failed to update Clerk metadata');
        }
    }

    async getUserById(userId: string) {
        try {
            return await this.clerkClient.users.getUser(userId);
        } catch (error) {
            console.error('Clerk API Error:', error);
            throw new Error('Failed to fetch user from Clerk');
        }
    }

    async syncStripeSubscriptionWithClerk(
        userId: string,
        stripeCustomerId: string,
        stripeSubscriptionId: string,
        subscriptionStatus: string
    ) {
        try {
            const metadata = {
                stripeCustomerId,
                stripeSubscriptionId,
                subscriptionStatus,
            };

            return await this.updateUserMetadata(userId, metadata);
        } catch (error) {
            console.error('Error syncing Stripe subscription with Clerk:', error);
            throw new Error('Failed to sync Stripe subscription with Clerk');
        }
    }
}
