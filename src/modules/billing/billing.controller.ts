import { Controller, Post, Body, Req, Res } from '@nestjs/common';
import { BillingService } from './billing.service';
import { Request, Response } from 'express';
import { RawBodyRequest } from '../../types/express';

@Controller('billing')
export class BillingController {
    constructor(private readonly billingService: BillingService) { }

    @Post('create-checkout-session')
    async createCheckoutSession(@Body('priceId') priceId: string) {
        return this.billingService.createCheckoutSession(priceId);
    }

    @Post('webhook')
    async handleStripeWebhook(@Req() req: RawBodyRequest, @Res() res: Response) {
        const sig = req.headers['stripe-signature'];
        const body = req.rawBody;

        try {
            await this.billingService.handleWebhook(body, sig as string);
            res.status(200).send('Webhook handled');
        } catch (err) {
            console.error('Webhook error:', err.message);
            res.status(400).send(`Webhook Error: ${err.message}`);
        }
    }
}
