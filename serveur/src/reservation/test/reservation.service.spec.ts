import { Test, TestingModule } from '@nestjs/testing';
import { ReservationService } from '../reservation.service';
import { PrismaService } from '../../prisma.service';
import { MoviesService } from '../../movies/movies.service';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Role } from '@prisma/client';

describe('ReservationService', () => {
    let reservationService: ReservationService;
    let prismaService: PrismaService;
    let moviesService: MoviesService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ReservationService,
                {
                    provide: PrismaService,
                    useValue: {
                        reservation: {
                            findMany: jest.fn(),
                            findUnique: jest.fn(),
                            create: jest.fn(),
                            delete: jest.fn(),
                        },
                        user: {
                            findUnique: jest.fn(),
                        },
                    },
                },
                {
                    provide: MoviesService,
                    useValue: {
                        getMovieById: jest.fn(),
                    },
                },
            ],
        }).compile();

        reservationService = module.get<ReservationService>(ReservationService);
        prismaService = module.get<PrismaService>(PrismaService);
        moviesService = module.get<MoviesService>(MoviesService);
    });

    describe('getAllReservations', () => {
        it('should return all reservations', async () => {
            const reservations = [
                {
                    reservationId: 1,
                    userId: 5,
                    reservedAt: new Date(),
                    endsAt: new Date(),
                    movieId: 1,
                    user: {
                        firstName: 'John',
                        email: 'john@example.com',
                    },
                },
            ];

            jest.spyOn(prismaService.reservation, 'findMany').mockResolvedValue(
                reservations as any,
            );

            const result = await reservationService.getAllReservations();
            expect(result).toEqual(reservations);
            expect(prismaService.reservation.findMany).toHaveBeenCalledTimes(1);
        });
    });

    describe('getMyReservations', () => {
        it('should return user reservations', async () => {
            const reservations = [
                {
                    reservationId: 1,
                    movieId: 1,
                    userId: 1,
                    reservedAt: new Date(),
                    endsAt: new Date(),
                    movieTitle: 'Movie 1',
                },
            ];

            jest.spyOn(moviesService, 'getMovieById').mockResolvedValue({
                title: 'Movie 1',
            } as any);

            jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue({
                userId: 1,
                firstName: 'John',
                email: 'john@example.com',
                password: 'hashedPassword',
                role: Role.User,
                reservations,
            } as any);

            const req = { userId: 1 };
            const result = await reservationService.getMyReservations(req);
            expect(result).toEqual(reservations);
        });

        it('should return an empty array if no reservations found', async () => {
            jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(
                null,
            );

            const result = await reservationService.getMyReservations({
                userId: 1,
            });
            expect(result).toEqual([]);
        });
    });

    describe('createReservation', () => {
        it('should create a reservation successfully', async () => {
            const movieId = 1;
            const reservedAt = new Date(Date.now() + 100000);
            const reservationDto = { movieId, reservedAt };

            const movie = { id: 1, title: 'Test Movie' };
            jest.spyOn(moviesService, 'getMovieById').mockResolvedValue(movie);

            jest.spyOn(prismaService.reservation, 'findMany').mockResolvedValue(
                [],
            );
            jest.spyOn(prismaService.reservation, 'create').mockResolvedValue({
                reservationId: 1,
                ...reservationDto,
            } as any);

            const result = await reservationService.createReservation({
                userId: 1,
                reservationBody: reservationDto,
            });

            expect(result.movieId).toBe(movieId);
            expect(result.reservedAt).toEqual(reservedAt);
        });

        it('should throw UnauthorizedException if userId is not provided', async () => {
            const reservationDto = { movieId: 1, reservedAt: new Date() };

            await expect(
                reservationService.createReservation({
                    userId: NaN,
                    reservationBody: reservationDto,
                }),
            ).rejects.toThrow(UnauthorizedException);
        });
    });

    describe('deleteReservation', () => {
        it('should delete the reservation successfully', async () => {
            const reservationId = 1;
            const userId = 1;
            const movieId = 1;
            const reservedAt = new Date();
            const endsAt = new Date();

            const findUniqueMock = jest
                .spyOn(prismaService.reservation, 'findUnique')
                .mockResolvedValue({
                    reservationId,
                    userId,
                    movieId,
                    reservedAt,
                    endsAt,
                } as any);

            const deleteMock = jest
                .spyOn(prismaService.reservation, 'delete')
                .mockResolvedValue({
                    reservationId,
                    userId,
                    movieId,
                    reservedAt,
                    endsAt,
                });

            const result = await reservationService.deleteReservation({
                reservationId,
            });

            expect(result.reservationId).toBe(reservationId);
            expect(result.message).toBe(
                'Reservation has been successfully deleted',
            );
            expect(findUniqueMock).toHaveBeenCalledWith({
                where: { reservationId },
            });
            expect(deleteMock).toHaveBeenCalledWith({
                where: { reservationId },
            });
        });

        it('should throw NotFoundException if reservation does not exist', async () => {
            const reservationId = 999;

            const findUniqueMock = jest
                .spyOn(prismaService.reservation, 'findUnique')
                .mockResolvedValue(null);

            await expect(
                reservationService.deleteReservation({ reservationId }),
            ).rejects.toThrow(NotFoundException);
            expect(findUniqueMock).toHaveBeenCalledWith({
                where: { reservationId },
            });
        });
    });
});
