import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthProvider, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { User as IUser } from 'src/identity/user/user.interface';
import { UserService } from 'src/identity/user/user.service';

import {
  BCRYPT_HASH_SALT,
  ERROR_INVALID_CREDENTIALS,
  ERROR_USER_NOT_FOUND,
} from '../constants/auth.constants';
import {
  LoginResponseDto,
  RegisterRequestDto,
  UserInfoDto,
} from '../dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userSrv: UserService,
    private readonly jwtSrv: JwtService,
  ) { }

  async validateUser(email: string, password: string) {
    const user = await this.userSrv.findOneByEmail(email);
    if (!user) throw new BadRequestException(ERROR_USER_NOT_FOUND);
    const match = bcrypt.compareSync(password, user.password);
    if (!match) throw new BadRequestException(ERROR_INVALID_CREDENTIALS);

    return user;
  }

  async login(validatedUser: IUser): Promise<LoginResponseDto> {
    const user = await this.userSrv.findOneByEmail(validatedUser.email);
    const payload = {
      email: validatedUser.email,
      id: validatedUser.id,
      role: validatedUser.role,
    };

    return {
      token: await this.jwtSrv.signAsync(payload),
      user: new UserInfoDto(user),
    };
  }

  async register(user: RegisterRequestDto): Promise<LoginResponseDto> {
    // const existingUser = await this.userSrv.findOneByEmail(user.email);
    // if (existingUser) throw new BadRequestException(ERROR_EMAIL_EXISTS);
    const hashedPassword = await bcrypt.hashSync(
      user.password,
      BCRYPT_HASH_SALT,
    );
    const newUser: IUser = {
      ...user,
      authProvider: AuthProvider.Local,
      password: hashedPassword,
    };
    await this.userSrv.create(newUser);
    const createdUser = await this.userSrv.findOneByEmail(user.email);

    return this.login(createdUser);
  }

  async profile(user: IUser): Promise<User> {
    if (!user) return;

    return this.userSrv.findOneByEmail(user.email);
  }

  async changePassword(email: string, newPassword: string): Promise<void> {
    const hashedPassword = await bcrypt.hashSync(newPassword, BCRYPT_HASH_SALT);
    await this.userSrv.updatePassword(email, hashedPassword);
  }
}
