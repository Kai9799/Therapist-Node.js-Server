import { Injectable, Logger } from '@nestjs/common';
import { clerkInstance } from 'src/config/clerk';
import { CustomJsonResponse } from 'src/types/CustomJsonResponse';
import { CreateOrganizationDto } from './organization.dto';
import { SupabaseService } from 'src/config/supabase';

@Injectable()
export class OrganizationService {
    private readonly logger = new Logger(OrganizationService.name);
    private readonly supabaseService: SupabaseService;

    constructor(supabaseService: SupabaseService) {
        this.supabaseService = supabaseService;
    }

    async createOrganization(
        dto: CreateOrganizationDto,
        clerkUserId: string
    ): Promise<CustomJsonResponse> {
        try {
            const organization = await clerkInstance.organizations.createOrganization({
                name: dto.name,
                createdBy: clerkUserId,
            });

            const { data, error } = await this.supabaseService.getClient()
                .from('organizations')
                .insert([
                    {
                        id: organization.id,
                        clerk_id: organization.id,
                        name: dto.name,
                        created_by: clerkUserId,
                    }
                ]);

            if (error) {
                this.logger.error('Failed to insert organization into Supabase', error);
                return {
                    status: 'failed',
                    message: 'Failed to insert organization into Supabase',
                    error: error,
                };
            }

            return {
                status: 'success',
                message: 'Organization created successfully',
                data: data,
            };
        } catch (err) {
            this.logger.error('Failed to create organization', err);
            return {
                status: 'failed',
                message: 'Failed to create organization',
                error: err,
            };
        }
    }
}
