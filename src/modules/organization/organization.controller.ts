import {
    Body,
    Controller,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { CreateOrganizationDto } from './organization.dto';
import { CustomJsonResponse } from 'src/types/CustomJsonResponse';

@Controller('organizations')
export class OrganizationController {
    constructor(private readonly service: OrganizationService) { }

    @UseGuards(AuthGuard)
    @Post()
    async create(
        @Req() req,
        @Body() dto: CreateOrganizationDto
    ): Promise<CustomJsonResponse> {
        const clerkUserId = req.user.sub;
        const clerkJWTToken = req.user.token;
        return this.service.createOrganization(dto, clerkUserId, clerkJWTToken);
    }
}
