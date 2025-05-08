import { Controller, Post, Body, Headers, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { WebhookService } from './webhook.service';

@Controller('webhook')
export class WebhookController {
    constructor(private readonly webhookService: WebhookService) { }

    @Post()
    async handleStripeWebhook(
        @Body() body: any,
        @Headers('stripe-signature') signature: string,
        @Req() req: Request,
        @Res() res: Response
    ) {
        const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;
        try {
            const event = await this.webhookService.verifyWebhookSignature(body, signature, endpointSecret);
            await this.webhookService.handleEvent(event);

            res.status(200).send('Event received');
        } catch (error) {
            console.error('Error handling Stripe webhook:', error);
            res.status(400).send('Webhook error');
        }
    }
}
