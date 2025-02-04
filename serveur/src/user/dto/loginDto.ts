import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
    @IsEmail(
        {},
        {
            message: 'Email must be an email',
        },
    )
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @MinLength(6, { message: 'Password must be at least 6 characters' })
    password: string;
}
