import { createClerkClient } from '@clerk/backend';
import * as dotenv from 'dotenv';

dotenv.config();

export const clerkInstance = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY!,
});
