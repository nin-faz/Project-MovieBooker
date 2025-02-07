import {
    Injectable,
    NotFoundException,
    ConflictException,
    BadRequestException,
    UnauthorizedException,
    UnprocessableEntityException,
} from '@nestjs/common';
import { ReservationDto } from './dto/reservationDto';
import { PrismaService } from '../prisma.service';
import { MoviesService } from '../movies/movies.service';

@Injectable()
export class ReservationService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly moviesService: MoviesService,
    ) {}

    async getAllReservations() {
        const reservations = this.prisma.reservation.findMany({
            select: {
                reservationId: true,
                reservedAt: true,
                endsAt: true,
                user: {
                    select: {
                        firstName: true,
                        email: true,
                    },
                },
                movieId: true,
            },
        });
        return reservations;
    }

    async getMyReservations({ userId }: { userId: number }) {
        if (!userId) {
            throw new UnauthorizedException(
                'You must be logged in to see your reservations',
            );
        }

        const myReservations = await this.prisma.user.findUnique({
            where: { userId },
            select: {
                reservations: true,
            },
        });

        if (!myReservations) {
            return [];
        }

        const myReservationsDetails = await Promise.all(
            myReservations.reservations.map(async (reservation) => {
                const movie = await this.moviesService.getMovieById(
                    reservation.movieId,
                );
                return {
                    ...reservation,
                    movieTitle: movie?.title,
                };
            }),
        );

        return myReservationsDetails;
    }

    async createReservation({
        userId,
        reservationBody,
    }: {
        userId: number;
        reservationBody: ReservationDto;
    }): Promise<any> {
        try {
            const { movieId, reservedAt } = reservationBody;

            if (!userId) {
                throw new UnauthorizedException(
                    'You must be logged in to book a movie',
                );
            }

            if (!reservedAt) {
                throw new BadRequestException('reservedAt is required');
            }

            const parsedReservedAt = new Date(reservedAt);

            const dateNow = new Date();
            if (parsedReservedAt < dateNow) {
                throw new UnprocessableEntityException(
                    'Reservation impossible, movie already started',
                );
            }

            const endsAt = new Date(parsedReservedAt);
            endsAt.setHours(endsAt.getHours() + 2);

            const movie = await this.getInformationsMovie(movieId);
            if (!movie) {
                throw new NotFoundException('Movie not found');
            }

            const existingReservations = await this.prisma.reservation.findMany(
                {
                    where: {
                        userId,

                        OR: [
                            {
                                reservedAt: { lte: endsAt },
                                endsAt: { gt: parsedReservedAt },
                            },
                        ],
                    },
                    select: { reservationId: true },
                },
            );

            if (existingReservations.length > 0) {
                throw new ConflictException(
                    'You already have a reservation between this slot',
                );
            }

            const newReservation = await this.prisma.reservation.create({
                data: {
                    userId,
                    movieId,
                    reservedAt: parsedReservedAt,
                    endsAt,
                },
            });

            return newReservation;
        } catch (error) {
            console.error('Error during reservation creation:', error);
            throw error;
        }
    }

    async deleteReservation({ reservationId }: { reservationId: number }) {
        const reservation = await this.prisma.reservation.findUnique({
            where: { reservationId },
        });

        if (!reservation) {
            throw new NotFoundException('Reservation not found');
        }

        await this.prisma.reservation.delete({
            where: { reservationId },
        });

        return {
            reservationId,
            message: 'Reservation has been successfully deleted',
        };
    }

    getInformationsMovie(movieId: number): Promise<any> {
        return this.moviesService.getMovieById(movieId);
    }
}
