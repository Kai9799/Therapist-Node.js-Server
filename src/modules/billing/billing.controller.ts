import { Controller, Post, Body, Req, Res, UseGuards } from '@nestjs/common';
import { BillingService } from './billing.service';
import { Response } from 'express';
import { RawBodyRequest } from '../../types/express';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('billing')
export class BillingController {
    constructor(private readonly billingService: BillingService) { }

    @UseGuards(AuthGuard)
    @Post('create-checkout-session')
    async createCheckoutSession(@Body() dto: CreateCheckoutSessionDto) {
        return this.billingService.createCheckoutSession(dto.priceId, dto.quantity);
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
