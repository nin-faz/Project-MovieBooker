import { ApiProperty } from '@nestjs/swagger';
import { IsISO8601, IsNotEmpty, IsNumber } from 'class-validator';

export class ReservationDto {
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({
        type: Number,
        description: 'movieId',
        example: 1114894,
        required: true,
    })
    movieId: number;

    @IsNotEmpty()
    @IsISO8601()
    @ApiProperty({
        type: Date,
        description: 'Booked time for the movie',
        example: '2026-02-06T18:00:00.000Z',
        required: true,
    })
    reservedAt: Date;
}
