import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        type: String,
        description: 'First name',
        example: 'Test',
        required: true,
    })
    firstName: string;

    @IsEmail(
        {},
        {
            message: 'Email must be an email',
        },
    )
    @IsNotEmpty()
    @ApiProperty({
        type: String,
        description: 'Email',
        example: 'test@gmail.com',
        required: true,
    })
    email: string;

    @IsNotEmpty()
    @MinLength(6, { message: 'Password must be at least 6 characters' })
    @ApiProperty({
        type: String,
        description: 'Password',
        example: 'abc123',
        required: true,
    })
    password: string;
}
