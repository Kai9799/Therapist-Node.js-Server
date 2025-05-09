import { IsString, Length } from 'class-validator';

export class CreateOrganizationDto {
    @IsString()
    @Length(3, 100)
    name: string;
}
