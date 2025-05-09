import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
    private readonly client: SupabaseClient;
    private supabaseUrl: string;
    private supabaseKey: string;

    constructor() {
        this.supabaseUrl = process.env.SUPABASE_URL!;
        this.supabaseKey = process.env.SUPABASE_ANON_KEY!;

        if (!this.supabaseUrl || !this.supabaseKey) {
            throw new Error('Supabase credentials are missing in environment variables');
        }

        this.client = createClient(this.supabaseUrl, this.supabaseKey);
    }

    getClientWithJWT(jwt: string): SupabaseClient {
        return createClient(this.supabaseUrl, this.supabaseKey, {
            global: {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            },
        });
    }

    getClient(): SupabaseClient {
        return this.client;
    }
}
