import { Injectable, UnauthorizedException } from '@nestjs/common';
import { clerkInstance } from 'src/config/clerk';
import { verifyToken } from '@clerk/backend';

@Injectable()
export class AuthService {
    async validateToken(token: string): Promise<any> {
        try {
            const verifiedToken = await verifyToken(token, {
                secretKey: process.env.CLERK_SECRET_KEY,
            });

            const userId = verifiedToken.sub;
            if (!userId) {
                throw new UnauthorizedException('User ID not found in token');
            }

            const user = await clerkInstance.users.getUser(userId);
            return user;
        } catch (error) {
            console.error('Clerk token authentication failed:', error);
            throw new UnauthorizedException('Invalid or expired token');
        }
    }
}
