import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';
import { ClerkService } from '../clerk/clerk.service';

@Module({
    imports: [],
    controllers: [WebhookController],
    providers: [WebhookService, ClerkService],
})
export class WebhookModule { }
