import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BillingModule } from './modules/billing/billing.module';

@Module({
  imports: [
    BillingModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
