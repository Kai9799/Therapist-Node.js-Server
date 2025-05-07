import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SupabaseService } from 'src/config/supabase';

@Module({
    providers: [AuthService, SupabaseService],
    exports: [AuthService],
})
export class AuthModule { }
