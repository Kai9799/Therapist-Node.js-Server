import { Injectable } from '@nestjs/common';
import { stripeInstance } from 'src/config/stripe';
import * as dotenv from 'dotenv';
import { CustomJsonResponse } from 'src/types/CustomJsonResponse';

dotenv.config();

@Injectable()
export class BillingService {
    private readonly appUrl: string;

    constructor() {
        this.appUrl = process.env.APP_URL!;
    }

    async createCheckoutSession(priceId: string, quantity: number): Promise<CustomJsonResponse> {
        try {
            const session = await stripeInstance.checkout.sessions.create({
                mode: 'subscription',
                payment_method_types: ['card'],
                line_items: [{ price: priceId, quantity }],
                subscription_data: {
                    trial_period_days: 14,
                },
                success_url: `${this.appUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${this.appUrl}/cancel`,
            });

            return {
                status: 'success',
                message: 'Checkout session created successfully',
                data: { url: session.url },
            };
        } catch (error) {
            return {
                status: 'failed',
                message: 'Failed to create checkout session',
                error,
            };
        }
    }

    async getProductsWithPrices(): Promise<CustomJsonResponse> {
        try {
            const products = await stripeInstance.products.list({ active: true });

            const productDetails = await Promise.all(
                products.data.map(async (product) => {
                    const prices = await stripeInstance.prices.list({
                        product: product.id,
                        active: true,
                        expand: ['data.tiers'],
                    });

                    return {
                        id: product.id,
                        name: product.name,
                        description: product.description,
                        metadata: product.metadata,
                        prices: prices.data.map((price) => ({
                            id: price.id,
                            unit_amount: price.unit_amount,
                            currency: price.currency,
                            recurring: price.recurring,
                            metadata: price.metadata,
                            tiers: price.tiers ?? null,
                        })),
                    };
                }),
            );

            return {
                status: 'success',
                message: 'Fetched products with prices',
                data: productDetails,
            };
        } catch (error) {
            return {
                status: 'failed',
                message: 'Failed to fetch products and prices',
                error,
            };
        }
    }

    async handleWebhook(body: Buffer, sig: string): Promise<CustomJsonResponse> {
        try {
            const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;
            const event = stripeInstance.webhooks.constructEvent(body, sig, endpointSecret);

            switch (event.type) {
                case 'checkout.session.completed':
                    // Handle successful checkout
                    break;
                case 'invoice.payment_succeeded':
                    // Handle successful payment
                    break;
                case 'customer.subscription.deleted':
                    // Handle subscription cancellation
                    break;
            }

            return {
                status: 'success',
                message: 'Webhook handled successfully',
            };
        } catch (error) {
            return {
                status: 'failed',
                message: 'Failed to process webhook',
                error,
            };
        }
    }
}
