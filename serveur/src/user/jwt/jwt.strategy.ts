import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

const secret = process.env.JWT_SECRET;

export type UserPayload = { userId: number };
export type RequestWithUser = { user: UserPayload };
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        if (!secret) {
            throw new Error('JWT_SECRET not set');
        }
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: secret,
        });
    }

    async validate({ userId }: UserPayload) {
        return { userId };
    }
}
