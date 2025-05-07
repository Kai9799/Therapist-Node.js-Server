import { IsString, MinLength } from 'class-validator';

export class CreateCheckoutSessionDto {
    @IsString({ message: 'priceId must be a string' })
    @MinLength(1, { message: 'priceId is required' })
    priceId: string;
}
