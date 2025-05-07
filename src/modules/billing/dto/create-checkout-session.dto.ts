import { IsInt, IsString, Min, MinLength } from 'class-validator';

export class CreateCheckoutSessionDto {
    @IsString({ message: 'priceId must be a string' })
    @MinLength(1, { message: 'priceId is required' })
    priceId: string;

    @IsInt()
    @Min(1)
    quantity: number;
}
