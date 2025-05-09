import { Injectable, Logger } from '@nestjs/common';
import { clerkInstance } from 'src/config/clerk';
import { CustomJsonResponse } from 'src/types/CustomJsonResponse';
import { CreateOrganizationDto } from './organization.dto';
import { SupabaseService } from 'src/config/supabase';

@Injectable()
export class OrganizationService {
    private readonly logger = new Logger(OrganizationService.name);

    constructor(private readonly supabaseService: SupabaseService) { }

    async createOrganization(
        dto: CreateOrganizationDto,
        clerkUserId: string,
        clerkJWTToken: string
    ): Promise<CustomJsonResponse> {
        try {
            const organization = await clerkInstance.organizations.createOrganization({
                name: dto.name,
                createdBy: clerkUserId,
            });

            const supabaseClient = this.supabaseService.getClientWithJWT(clerkJWTToken);
            const { data: orgData, error: orgError } = await supabaseClient
                .from('organizations')
                .insert([
                    {
                        clerk_id: organization.id,
                        name: dto.name,
                        created_by: clerkUserId,
                    },
                ])
                .select()
                .single();

            if (orgError || !orgData) {
                this.logger.error('Failed to insert organization into Supabase', orgError);
                return {
                    status: 'failed',
                    message: 'Failed to insert organization into Supabase',
                    error: orgError || new Error('Failed to insert organization into Supabase'),
                };
            }

            const { error: userUpdateError } = await supabaseClient
                .from('users')
                .update({ organization_id: orgData.id })
                .eq('clerk_id', clerkUserId);

            if (userUpdateError) {
                this.logger.error('Failed to update user with organization ID', userUpdateError);
                return {
                    status: 'failed',
                    message: 'Organization created but failed to update user',
                    error: userUpdateError,
                };
            }

            return {
                status: 'success',
                message: 'Organization created and user updated successfully',
                data: orgData,
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
