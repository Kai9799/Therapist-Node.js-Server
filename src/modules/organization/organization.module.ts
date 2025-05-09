import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { AuthService } from '../auth/auth.service';
import { SupabaseService } from 'src/config/supabase';

@Module({
    imports: [],
    controllers: [OrganizationController],
    providers: [OrganizationService, AuthService, SupabaseService],
})
export class OrganizationModule { }
