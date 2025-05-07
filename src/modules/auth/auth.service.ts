import { Injectable, UnauthorizedException } from "@nestjs/common";
import { SupabaseService } from "src/config/supabase";

@Injectable()
export class AuthService {
    private supabase;

    constructor(private readonly supabaseService: SupabaseService) {
        this.supabase = this.supabaseService.getClient();
    }

    async validateToken(token: string): Promise<any> {
        const { data, error } = await this.supabase.auth.getUser(token);
        console.log(error);

        if (error) {
            throw new UnauthorizedException('Invalid or expired token');
        }

        return data.user;
    }
}
