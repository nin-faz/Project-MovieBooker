import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { PrismaService } from '../../prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import { RegisterDto } from '../dto/registerDto';
import { LoginDto } from '../dto/loginDto';
import { Role } from '@prisma/client';

jest.mock('bcrypt', () => ({
    hash: jest.fn().mockResolvedValue('hashedPassword'),
    compare: jest.fn().mockResolvedValue(true),
}));

describe('UserService', () => {
    let service: UserService;
    let prisma: PrismaService;
    let jwtService: JwtService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: PrismaService,
                    useValue: {
                        user: {
                            findMany: jest.fn(),
                            findUnique: jest.fn(),
                            create: jest.fn(),
                        },
                    },
                },
                {
                    provide: JwtService,
                    useValue: {
                        sign: jest.fn().mockReturnValue('mockedToken'),
                    },
                },
            ],
        }).compile();

        service = module.get<UserService>(UserService);
        prisma = module.get<PrismaService>(PrismaService);
        jwtService = module.get<JwtService>(JwtService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getAllUsers', () => {
        it('should return a list of users', async () => {
            const mockUsers = [
                {
                    userId: 1,
                    firstName: 'John',
                    email: 'john@example.com',
                    password: 'hashedPassword',
                    role: Role.User,
                },
            ];
            jest.spyOn(prisma.user, 'findMany').mockResolvedValue(mockUsers);

            const result = await service.getAllUsers();
            expect(result).toEqual(mockUsers);
            expect(prisma.user.findMany).toHaveBeenCalled();
        });
    });

    describe('getUser', () => {
        it('should return a user', async () => {
            const mockUser: {
                userId: number;
                firstName: string;
                email: string;
                password: string;
                role: Role;
            } = {
                userId: 1,
                firstName: 'John',
                email: 'john@example.com',
                password: 'hashedPassword',
                role: Role.User,
            };

            jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUser);

            const result = await service.getUser({ userId: 1 });
            expect(result).toEqual(mockUser);
            expect(prisma.user.findUnique).toHaveBeenCalledWith({
                where: { userId: 1 },
                select: { firstName: true, email: true },
            });
        });
    });

    describe('register', () => {
        it('should create a new user and return a token', async () => {
            const registerBody: RegisterDto = {
                firstName: 'John',
                email: 'john@example.com',
                password: 'password',
            };
            jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);
            jest.spyOn(prisma.user, 'create').mockResolvedValue({
                userId: 1,
                firstName: 'John',
                email: 'john@example.com',
                password: 'hashedPassword',
                role: Role.User,
            });
            jest.spyOn(jwtService, 'sign').mockReturnValue('mockedToken');

            const result = await service.register({ registerBody });
            expect(result).toEqual({ access_token: 'mockedToken' });
        });

        it('should throw ConflictException if user already exists', async () => {
            jest.spyOn(prisma.user, 'findUnique').mockResolvedValue({
                userId: 1,
                firstName: 'John',
                email: 'existing@example.com',
                password: 'hashedPassword',
                role: Role.User,
            });

            await expect(
                service.register({
                    registerBody: {
                        firstName: 'Test',
                        email: 'existing@example.com',
                        password: '123456',
                    },
                }),
            ).rejects.toThrow(ConflictException);
        });
    });

    describe('login', () => {
        it('should return a token for valid credentials', async () => {
            const loginBody: LoginDto = {
                email: 'john@example.com',
                password: 'password',
            };
            jest.spyOn(prisma.user, 'findUnique').mockResolvedValue({
                userId: 1,
                firstName: 'John',
                email: 'john@example.com',
                password: 'hashedPassword',
                role: Role.User,
            });
            jest.mock('bcrypt', () => ({
                hash: jest.fn().mockResolvedValue('hashedPassword'),
                compare: jest.fn().mockResolvedValue(true as boolean),
            }));

            const result = await service.login({ authBody: loginBody });
            expect(result).toEqual({ access_token: 'mockedToken' });
        });

        it('should throw UnauthorizedException if user does not exist', async () => {
            jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);

            await expect(
                service.login({
                    authBody: {
                        email: 'notfound@example.com',
                        password: '123456',
                    },
                }),
            ).rejects.toThrow(UnauthorizedException);
        });

        it('should throw UnauthorizedException if password is incorrect', async () => {
            jest.spyOn(require('bcrypt'), 'compare').mockResolvedValue(false);

            await expect(
                service.login({
                    authBody: {
                        email: 'john@example.com',
                        password: 'wrongpassword',
                    },
                }),
            ).rejects.toThrow(UnauthorizedException);
        });
    });
});
