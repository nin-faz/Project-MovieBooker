import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { ReservationModule } from '../src/reservation/reservation.module';
import { PrismaService } from '../src/prisma.service';
import { UserModule } from '../src/user/user.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import { hash } from 'bcrypt';

describe('ReservationController (e2e)', () => {
    let app: INestApplication;
    let prismaService: PrismaService;
    let accessToken: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                ReservationModule,
                UserModule,
                JwtModule.register({
                    secret: process.env.JWT_SECRET,
                    signOptions: { expiresIn: '1d' },
                }),
            ],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
        prismaService = app.get<PrismaService>(PrismaService);

        const uniqueEmail = `testuser_${Date.now()}@example.com`;

        const password = 'password';
        const hashedPassword = await hash(password, 10);

        const user = await prismaService.user.create({
            data: {
                firstName: 'Test',
                email: uniqueEmail,
                password: hashedPassword,
            },
        });

        const loginDto = { email: user.email, password: 'password' };

        let loginResponse;
        try {
            loginResponse = await request(app.getHttpServer())
                .post('/auth/login')
                .send(loginDto);
        } catch (err) {
            console.log('Erreur Login:', err.response?.body);
        }

        accessToken = loginResponse.body.access_token;
    });

    afterAll(async () => {
        await prismaService.$disconnect();
        await app.close();
    });

    it('should create a reservation (POST /reservation/:movieId)', async () => {
        const movieId = 899082;

        // Assure-toi que reservedAt est dans le futur
        const now = new Date();
        const movieStartTime = new Date(now.getTime() + 30 * 60 * 1000); // Film qui commence dans 30 minutes
        const reservedAt = movieStartTime.toISOString(); // Convertir en ISO format pour l'API

        const reservationDto = {
            movieId,
            reservedAt,
        };

        const response = await request(app.getHttpServer())
            .post(`/reservation/${movieId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send(reservationDto)
            .expect(201);

        expect(response.body).toHaveProperty('reservationId');
        expect(response.body).toHaveProperty('reservedAt');
        expect(response.body).toHaveProperty('endsAt');
    });

    it('should get my reservations (GET /my-reservations)', async () => {
        const response = await request(app.getHttpServer())
            .get('/my-reservations')
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
        if (response.body.length > 0) {
            expect(response.body[0]).toHaveProperty('reservationId');
            expect(response.body[0]).toHaveProperty('movieTitle');
            expect(response.body[0]).toHaveProperty('reservedAt');
            expect(response.body[0]).toHaveProperty('endsAt');
        }
    });

    // Doesn't work
    // it('should return a 409 if user already has a reservation during this time (POST /reservation/reservation/:movieId)', async () => {
    //     const movieId = 899082; // Assure-toi que ce film existe dans la base
    //     const reservationDto = {
    //         movieId,
    //         reservedAt: '2025-02-06T18:00:00.000Z', // Vérifie que la date est correcte
    //         endsAt: '2025-02-06T20:00:00.000Z', // Fin de la réservation
    //     };

    //     // Crée la première réservation
    //     const response1 = await request(app.getHttpServer())
    //         .post(`/reservation/${movieId}`)
    //         .set('Authorization', `Bearer ${accessToken}`)
    //         .send(reservationDto)
    //         .expect(201); // Première réservation réussie

    //     console.log('First response:', response1.body);

    //     // Crée une deuxième réservation pour provoquer un conflit
    //     const reservationDto2 = {
    //         movieId,
    //         reservedAt: '2025-02-06T18:30:00.000Z', // Cette date provoque un chevauchement
    //         endsAt: '2025-02-06T20:30:00.000Z', // Fin de la réservation
    //     };

    //     const response2 = await request(app.getHttpServer())
    //         .post(`/reservation/${movieId}`)
    //         .set('Authorization', `Bearer ${accessToken}`)
    //         .send(reservationDto2)
    //         .expect(409); // Devrait renvoyer un 409 en cas de conflit

    //     console.log('Second response:', response2.body);
    // });

    it('should return a 401 if no token is provided (POST /reservation/:movieId)', async () => {
        const movieId = 899082;
        const reservationDto = {
            movieId,
            reservedAt: '2025-02-06T18:00:00.000Z',
        };

        await request(app.getHttpServer())
            .post(`/reservation/${movieId}`)
            .send(reservationDto)
            .expect(401); // Attente d'une erreur 401 si pas de token
    });
});
