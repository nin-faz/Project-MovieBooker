import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';
import { RegisterDto } from '../dto/registerDto';
import { LoginDto } from '../dto/loginDto';
import { Role } from '@prisma/client';

describe('UserController', () => {
    let userController: UserController;
    let userService: UserService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [
                {
                    provide: UserService,
                    useValue: {
                        getAllUsers: jest.fn(),
                        getUser: jest.fn(),
                        register: jest.fn(),
                        login: jest.fn(),
                    },
                },
            ],
        }).compile();

        userController = module.get<UserController>(UserController);
        userService = module.get<UserService>(UserService);
    });

    it('should be defined', () => {
        expect(userController).toBeDefined();
    });

    describe('getAllUsers', () => {
        it('should return an array of users', async () => {
            const mockUsers = [
                {
                    userId: 1,
                    firstName: 'John',
                    email: 'john@example.com',
                    role: Role.User,
                },
            ];
            jest.spyOn(userService, 'getAllUsers').mockResolvedValue(mockUsers);

            const result = await userController.getAllUsers();
            expect(result).toEqual(mockUsers);
            expect(userService.getAllUsers).toHaveBeenCalled();
        });
    });

    describe('getUser', () => {
        it('should return a user by ID', async () => {
            const mockUser = {
                userId: 1,
                firstName: 'John',
                email: 'john@example.com',
                role: Role.User,
            };
            jest.spyOn(userService, 'getUser').mockResolvedValue(mockUser);

            const result = await userController.getUser('1');
            expect(result).toEqual(mockUser);
            expect(userService.getUser).toHaveBeenCalledWith({ userId: 1 });
        });
    });

    describe('register', () => {
        it('should register a user and return a success message with newUser', async () => {
            const registerBody: RegisterDto = {
                firstName: 'John',
                email: 'john@example.com',
                password: 'password',
            };

            const mockNewUser = {
                userId: 1,
                firstName: 'John',
                email: 'john@example.com',
                password: 'hashedPassword',
                role: Role.User,
            };

            const mockResponse = {
                message: 'Success : User registered !',
                newUser: mockNewUser,
            };

            jest.spyOn(userService, 'register').mockResolvedValue(mockResponse);

            const result = await userController.register(registerBody);

            expect(result).toEqual(mockResponse);

            expect(userService.register).toHaveBeenCalledWith({ registerBody });
        });
    });

    describe('login', () => {
        it('should log in a user and return an access token', async () => {
            const loginBody: LoginDto = {
                email: 'john@example.com',
                password: 'password123',
            };
            const mockToken = { access_token: 'mockedToken' };

            jest.spyOn(userService, 'login').mockResolvedValue(mockToken);

            const result = await userController.login(loginBody);
            expect(result).toEqual(mockToken);
            expect(userService.login).toHaveBeenCalledWith({
                authBody: loginBody,
            });
        });
    });
});
