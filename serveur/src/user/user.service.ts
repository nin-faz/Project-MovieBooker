import {
    Injectable,
    UnauthorizedException,
    ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/registerDto';
import { hash, compare } from 'bcrypt';
import { UserPayload } from './jwt/jwt.strategy';
import { LoginDto } from './dto/loginDto';

@Injectable()
export class UserService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
    ) {}

    async getAllUsers() {
        const users = await this.prisma.user.findMany({
            select: {
                userId: true,
                firstName: true,
                email: true,
                role: true,
            },
        });
        return users;
    }

    async getUser({ userId }: { userId: number }) {
        const user = await this.prisma.user.findUnique({
            where: { userId: userId },
            select: {
                firstName: true,
                email: true,
            },
        });
        return user;
    }

    async register({ registerBody }: { registerBody: RegisterDto }) {
        // try {
        const { email, password, firstName } = registerBody;

        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            throw new ConflictException('User already exists');
        }

        const hashPassword = await this.hashPassword({ password });

        const newUser = await this.prisma.user.create({
            data: {
                firstName,
                email,
                password: hashPassword,
            },
        });

        console.log('Success : User registered !', { existingUser });
        return this.authenticateUser({ userId: newUser.userId });
        // } catch (error) {
        //     console.log('User not registered !', { error });
        //     return {
        //         error: true,
        //         message: error.message,
        //     };
        // }
    }

    private async hashPassword({ password }: { password: string }) {
        return await hash(password, 10);
    }

    async login({ authBody }: { authBody: LoginDto }) {
        // try {
        const { email, password } = authBody;

        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        });

        if (!existingUser) {
            throw new UnauthorizedException("User doesn't exist");
        }

        const isPasswordValid = await this.verifyPassword({
            password,
            hashedPassword: existingUser.password,
        });

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid password');
        }

        console.log('Success : User logged in !', { existingUser });
        return this.authenticateUser({ userId: existingUser.userId });
        // } catch (error) {
        //     console.log('User not logged in !', { error });
        //     return {
        //         error: true,
        //         message: error.message,
        //     };
        // }
    }

    private async verifyPassword({
        password,
        hashedPassword,
    }: {
        password: string;
        hashedPassword: string;
    }) {
        const isPasswordValid = await compare(password, hashedPassword);
        return isPasswordValid;
    }

    private async authenticateUser({ userId }: UserPayload) {
        const payload: UserPayload = { userId };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
