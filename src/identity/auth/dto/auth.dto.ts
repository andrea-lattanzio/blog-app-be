import { User } from '@prisma/client';
import { Exclude, plainToInstance } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class LoginRequestDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty()
  password: string;
}

export class LoginResponseDto {
  token: string;
  user: Partial<User>;
}

export class RegisterRequestDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsString({ message: 'Password must be a string' })
  @MinLength(5, { message: 'Password must be at least 5 characters long' })
  @Matches(/^(?=.*[0-9])(?=.*[!@#$%^&*])/, {
    message:
      'Password must contain at least one number and one special character',
  })
  password: string;
}

export class UserInfoDto {
  email: string;
  @Exclude()
  id: string;
  @Exclude()
  password: string;
  @Exclude()
  authProvider: string;
  @Exclude()
  createdAt: string;
  @Exclude()
  updatedAt: string;

  constructor(user: User) {
    Object.assign(this, plainToInstance(UserInfoDto, user));
  }
}
