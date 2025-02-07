import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UserModule } from '../src/user/user.module';
import { PrismaService } from '../src/prisma.service';
import { hash } from 'bcrypt';

describe('UserController (e2e)', () => {
    let app: INestApplication;
    let prisma: PrismaService;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [UserModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        prisma = moduleFixture.get<PrismaService>(PrismaService);

        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('POST /register', () => {
        it('should register a user and return a success message', async () => {
            const email = `test+${Date.now()}@example.com`;
            const registerDto = {
                firstName: 'Test',
                email,
                password: 'password',
            };

            const response = await request(app.getHttpServer())
                .post('/auth/register')
                .send(registerDto)
                .expect(201);

            expect(response.body.message).toBe('Success : User registered !');
            expect(response.body.newUser).toHaveProperty('userId');
        });

        it('should throw ConflictException if user already exists', async () => {
            const email = `test+${Date.now()}@example.com`;
            await prisma.user.create({
                data: {
                    firstName: 'Existing',
                    email,
                    password: 'password',
                },
            });

            const registerDto = {
                firstName: 'Test',
                email,
                password: 'password',
            };

            const response = await request(app.getHttpServer())
                .post('/auth/register')
                .send(registerDto)
                .expect(409);

            expect(response.body.message).toBe('User already exists');
        });
    });

    describe('POST /login', () => {
        it('should log in a user and return an access token', async () => {
            const email = `test+${Date.now()}@example.com`;
            const password = 'password123';
            await prisma.user.create({
                data: {
                    firstName: 'John',
                    email,
                    password: await hash(password, 10),
                },
            });

            const loginDto = {
                email,
                password: 'password123',
            };

            const response = await request(app.getHttpServer())
                .post('/auth/login')
                .send(loginDto)
                .expect(200);

            expect(response.body.access_token).toBeDefined();
        });

        it('should throw UnauthorizedException if user does not exist', async () => {
            const email = `nonexistent+${Date.now()}@example.com`;
            const loginDto = { email, password: 'password' };

            const response = await request(app.getHttpServer())
                .post('/auth/login')
                .send(loginDto)
                .expect(401);

            expect(response.body.message).toBe("User doesn't exist");
        });

        it('should throw UnauthorizedException if password is incorrect', async () => {
            const email = `test+${Date.now()}@example.com`;
            const password = 'correctpassword';

            await prisma.user.create({
                data: {
                    firstName: 'John',
                    email,
                    password: await hash(password, 10),
                },
            });

            const wrongPasswordDto = { email, password: 'wrongpassword' };

            const response = await request(app.getHttpServer())
                .post('/auth/login')
                .send(wrongPasswordDto)
                .expect(401);

            expect(response.body.message).toBe('Invalid password');
        });
    });
});
