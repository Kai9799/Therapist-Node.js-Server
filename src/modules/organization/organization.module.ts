import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { AuthService } from '../auth/auth.service';

@Module({
    imports: [],
    controllers: [OrganizationController],
    providers: [OrganizationService, AuthService],
})
export class OrganizationModule { }
