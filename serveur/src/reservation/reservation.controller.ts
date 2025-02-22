import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    UseGuards,
    Request,
} from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiBody,
    ApiConflictResponse,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiParam,
    ApiUnauthorizedResponse,
    ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { ReservationService } from './reservation.service';
import { ReservationDto } from './dto/reservationDto';
import { JwtAuthGuard } from '../user/jwt/jwt.guard';

@Controller()
export class ReservationController {
    constructor(private readonly reservationService: ReservationService) {}

    @Get('reservations')
    @ApiOkResponse({
        description: 'List of all reservations',
        schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    reservationId: { type: 'number', example: 10 },
                    userId: { type: 'number', example: 12 },
                    firstName: { type: 'string', example: 'Test' },
                    email: { type: 'string', example: 'test@gmail.com' },
                    role: { type: 'string', example: 'USER' },
                    movieId: { type: 'number', example: 1114894 },
                    reservedAt: {
                        type: 'string',
                        example: '2025-02-06T18:00:00.000Z',
                    },
                    endsAt: {
                        type: 'string',
                        example: '2025-02-06T20:00:00.000Z',
                    },
                },
            },
        },
    })
    getAllReservations() {
        return this.reservationService.getAllReservations();
    }

    @Get('my-reservations')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOkResponse({
        description: 'List of my reservations',
        schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    reservationId: { type: 'number', example: 10 },
                    reservedAt: {
                        type: 'string',
                        example: '2025-02-06T18:00:00.000Z',
                    },
                    endsAt: {
                        type: 'string',
                        example: '2025-02-06T20:00:00.000Z',
                    },
                    movieId: { type: 'number', example: 970450 },
                    movieTitle: { type: 'string', example: 'Werewolves' },
                },
            },
        },
    })
    @ApiUnauthorizedResponse({
        description: 'You must be logged in to see your reservations',
    })
    getMyReservations(@Request() req) {
        console.log('User:', req.user);
        return this.reservationService.getMyReservations({
            userId: req.user.userId,
        });
    }

    @Post('reservation/:movieId')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiCreatedResponse({
        description: 'User has successfully booked his film',
    })
    @ApiBadRequestResponse({
        description: 'Invalid data(s)',
    })
    @ApiUnauthorizedResponse({
        description: 'You must be logged in to book a movie',
    })
    @ApiConflictResponse({
        description: 'You already have a reservation between this slot',
    })
    @ApiUnprocessableEntityResponse({
        description: 'Reservation impossible, movie already started',
    })
    @ApiBody({ type: ReservationDto })
    create(
        @Request() req,
        @Param('movieId') movieId: number,
        @Body() reservationBody: ReservationDto,
    ) {
        return this.reservationService.createReservation({
            userId: req.user.userId,
            reservationBody: { ...reservationBody, movieId: Number(movieId) },
        });
    }

    @Delete('my-reservations/:reservationId')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOkResponse({
        description: 'Reservation has been successfully deleted',
        schema: {
            type: 'object',
            properties: {
                reservationId: { type: 'number', example: 10 },
                message: {
                    type: 'string',
                    example: 'Reservation has been successfully deleted',
                },
            },
        },
    })
    @ApiParam({
        name: 'reservationId',
        type: 'number',
        required: true,
        description: 'Reservation ID',
        example: 2,
    })
    @ApiBadRequestResponse({
        description: 'Invalid reservation ID',
    })
    @ApiUnauthorizedResponse({
        description: 'You must be logged in to delete a reservation',
    })
    deleteReservation(@Param('reservationId') reservationId: number) {
        return this.reservationService.deleteReservation({
            reservationId,
        });
    }
}
