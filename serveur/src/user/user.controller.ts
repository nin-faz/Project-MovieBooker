import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    UseGuards,
    Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterDto } from './dto/registerDto';
import { JwtAuthGuard } from './jwt/jwt.guard';
import { RequestWithUser } from './jwt/jwt.strategy';
import { LoginDto } from './dto/loginDto';

@Controller('auth')
export class UserController {
    constructor(private readonly userService: UserService) {}
    @Get('/users')
    getUsers() {
        return this.userService.getUsers();
    }

    @Get('/user/:userId')
    getUser(@Param('userId') userId: string) {
        const parsedUserId = parseInt(userId, 10);
        return this.userService.getUser({ userId: parsedUserId });
    }

    @Post('/register')
    async register(@Body() registerBody: RegisterDto) {
        return await this.userService.register({ registerBody });
    }

    @Post('/login')
    async login(@Body() authBody: LoginDto) {
        return await this.userService.login({ authBody });
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async authenticateUser(@Request() request: RequestWithUser) {
        return await this.userService.getUser({
            userId: request.user.userId,
        });
    }
}
