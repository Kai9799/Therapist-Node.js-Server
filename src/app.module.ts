import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BillingModule } from './modules/billing/billing.module';
import { WebhookModule } from './modules/webhook/webhook.module';
import { OrganizationModule } from './modules/organization/organization.module';

@Module({
  imports: [
    BillingModule,
    WebhookModule,
    OrganizationModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
