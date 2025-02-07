import { Test, TestingModule } from '@nestjs/testing';
import { ReservationController } from '../reservation.controller';
import { ReservationService } from '../reservation.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { ReservationDto } from '../dto/reservationDto';
import { PrismaService } from '../../prisma.service';
import { Role } from '@prisma/client';
import { MoviesService } from '../../movies/movies.service';

describe('ReservationController', () => {
    let controller: ReservationController;
    let reservationService: ReservationService;
    let prismaService: PrismaService;
    let moviesService: MoviesService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ReservationController],
            providers: [
                ReservationService,
                PrismaService,
                {
                    provide: ReservationService,
                    useValue: {
                        getAllReservations: jest.fn(),
                        getMyReservations: jest.fn(),
                        createReservation: jest.fn(),
                        deleteReservation: jest.fn(),
                    },
                },
                {
                    provide: PrismaService,
                    useValue: {
                        user: {
                            findUnique: jest.fn(),
                        },
                        reservation: {
                            findMany: jest.fn(),
                            create: jest.fn(),
                            delete: jest.fn(),
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

        controller = module.get<ReservationController>(ReservationController);
        reservationService = module.get<ReservationService>(ReservationService);
        prismaService = module.get<PrismaService>(PrismaService);
        moviesService = module.get<MoviesService>(MoviesService);
    });

    describe('getAllReservations', () => {
        it('should return all reservations', async () => {
            const reservations = [
                {
                    reservationId: 1,
                    movieId: 1,
                    reservedAt: new Date(),
                    endsAt: new Date(),
                    user: {
                        firstName: 'John',
                        email: 'john@example.com',
                    },
                },
            ];
            jest.spyOn(
                reservationService,
                'getAllReservations',
            ).mockResolvedValue(reservations);

            const result = await controller.getAllReservations();
            expect(result).toEqual(reservations);
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

            jest.spyOn(
                reservationService,
                'getMyReservations',
            ).mockResolvedValue(reservations);

            const req = { user: { userId: 1 } };
            const result = await controller.getMyReservations(req);
            expect(result).toEqual(reservations);
        });

        it('should return an empty array if no reservations found', async () => {
            jest.spyOn(
                reservationService,
                'getMyReservations',
            ).mockResolvedValue([]);

            const req = { user: { userId: 1 } };
            const result = await controller.getMyReservations(req);
            expect(result).toEqual([]);
        });
    });

    describe('create', () => {
        it('should create a reservation successfully', async () => {
            const reservationDto: ReservationDto = {
                movieId: 1,
                reservedAt: new Date(),
            };
            const createdReservation = {
                reservationId: 1,
                ...reservationDto,
            };
            jest.spyOn(
                reservationService,
                'createReservation',
            ).mockResolvedValue(createdReservation);

            const req = { user: { userId: 1 } };
            const result = await controller.create(req, reservationDto);

            expect(result).toEqual(createdReservation);
        });

        it('should throw ConflictException if reservation already exists', async () => {
            const reservationDto: ReservationDto = {
                movieId: 1,
                reservedAt: new Date(),
            };
            jest.spyOn(
                reservationService,
                'createReservation',
            ).mockRejectedValue(new ConflictException('Conflict'));

            const req = { user: { userId: 1 } };
            await expect(
                controller.create(req, reservationDto),
            ).rejects.toThrow(ConflictException);
        });
    });

    describe('deleteReservation', () => {
        it('should delete a reservation successfully', async () => {
            const reservationId = 1;
            const response = {
                reservationId,
                message: 'Reservation has been successfully deleted',
            };
            jest.spyOn(
                reservationService,
                'deleteReservation',
            ).mockResolvedValue(response);

            const result = await controller.deleteReservation(reservationId);
            expect(result).toEqual(response);
        });

        it('should throw NotFoundException if reservation does not exist', async () => {
            const reservationId = 999;

            jest.spyOn(
                reservationService,
                'deleteReservation',
            ).mockRejectedValue(new NotFoundException('Reservation not found'));

            await expect(
                controller.deleteReservation(reservationId),
            ).rejects.toThrow(NotFoundException);
        });
    });
});
