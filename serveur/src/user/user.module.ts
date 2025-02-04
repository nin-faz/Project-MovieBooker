import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtModule } from '@nestjs/jwt';
import { UserController } from './user.controller';
import { PrismaService } from 'src/prisma.service';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/guards/roles.guard';
import { JwtStrategy } from './jwt/jwt.strategy';

@Module({
    imports: [
        JwtModule.register({
            global: true,
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '2h' },
        }),
    ],
    controllers: [UserController],
    providers: [
        UserService,
        PrismaService,

        JwtStrategy,
        {
            provide: APP_GUARD,
            useClass: RolesGuard,
        },
    ],
})
export class UserModule {}
