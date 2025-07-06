import { IsEmail, IsString, Matches } from 'class-validator';

export class RequestResetPasswordDto {
    @IsEmail()
    email: string;
}

export class ResetPasswordDto {
    @IsEmail()
    email: string;

    @IsString()
    token: string;

    @IsString()
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
      message:
            'Password must be at least 8 characters, with 1 letter, 1 number, and 1 special character',
    })
    newPassword: string;
}
