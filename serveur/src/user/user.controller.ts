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

import {
    ApiBearerAuth,
    ApiBody,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiUnauthorizedResponse,
    ApiBadRequestResponse,
    ApiConflictResponse,
} from '@nestjs/swagger';

@Controller('auth')
export class UserController {
    constructor(private readonly userService: UserService) {}
    @Get('/users')
    @ApiOkResponse({
        description: 'List of all users',
        schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    userId: { type: 'number', example: 15 },
                    firstName: { type: 'string', example: 'Test' },
                    email: { type: 'string', example: 'test@gmail.com' },
                    role: { type: 'string', example: 'USER' },
                },
            },
        },
    })
    getAllUsers() {
        return this.userService.getAllUsers();
    }

    @Get('/user/:userId')
    @ApiOkResponse({
        description: 'Get user by ID',
        type: RegisterDto,
    })
    @ApiBadRequestResponse({
        description: 'Invalid User ID',
    })
    getUser(@Param('userId') userId: string) {
        const parsedUserId = parseInt(userId, 10);
        return this.userService.getUser({ userId: parsedUserId });
    }

    @Post('/register')
    @ApiCreatedResponse({
        description: 'User has been successfully registered',
    })
    @ApiConflictResponse({
        description: 'User already exists',
    })
    @ApiBadRequestResponse({
        description: 'Invalid data(s)',
    })
    @ApiBody({ type: RegisterDto })
    async register(@Body() registerBody: RegisterDto) {
        return await this.userService.register({ registerBody });
    }

    @Post('/login')
    @ApiOkResponse({
        description: 'User has been successfully logged in',
    })
    @ApiBadRequestResponse({
        description: 'Invalid credentials',
    })
    @ApiUnauthorizedResponse({
        description: "User doesn't exist",
    })
    @ApiBody({ type: LoginDto })
    async login(@Body() authBody: LoginDto) {
        return await this.userService.login({ authBody });
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOkResponse({
        description: 'Authenticated user',
    })
    @ApiUnauthorizedResponse({
        description: 'Unauthorized access, invalid or expired token',
    })
    async authenticateUser(@Request() request: RequestWithUser) {
        return await this.userService.getUser({
            userId: request.user.userId,
        });
    }
}
