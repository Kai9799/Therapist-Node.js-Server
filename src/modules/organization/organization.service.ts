import { Injectable, Logger } from '@nestjs/common';
import { clerkInstance } from 'src/config/clerk';
import { CustomJsonResponse } from 'src/types/CustomJsonResponse';
import { CreateOrganizationDto } from './organization.dto';

@Injectable()
export class OrganizationService {
    private readonly logger = new Logger(OrganizationService.name);

    async createOrganization(
        dto: CreateOrganizationDto,
        clerkUserId: string
    ): Promise<CustomJsonResponse> {
        try {
            const organization = await clerkInstance.organizations.createOrganization({
                name: dto.name,
                createdBy: clerkUserId,
            });

            return {
                status: 'success',
                message: 'Organization created successfully',
                data: organization,
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
