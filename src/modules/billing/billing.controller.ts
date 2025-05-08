import { Controller, Post, Body, Req, Res, UseGuards, Get } from '@nestjs/common';
import { BillingService } from './billing.service';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('billing')
export class BillingController {
    constructor(private readonly billingService: BillingService) { }

    // @UseGuards(AuthGuard)
    @Post('create-checkout-session')
    async createCheckoutSession(@Body() dto: CreateCheckoutSessionDto) {
        return this.billingService.createCheckoutSession(dto.priceId, dto.quantity);
    }

    // @UseGuards(AuthGuard)
    @Get('products')
    async getProductsWithPrices() {
        return this.billingService.getProductsWithPrices();
    }
}
