import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
    @IsString()
    @IsNotEmpty()
    firstName: string;

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
