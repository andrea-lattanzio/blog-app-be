import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthProvider, User, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { User as IUser } from 'src/identity/user/user.interface';
import { UserService } from 'src/identity/user/user.service';
import { assertIsUser } from 'src/shared/utils/auth';

import {
  BCRYPT_HASH_SALT,
  ERROR_INVALID_CREDENTIALS,
  ERROR_USER_NOT_FOUND,
} from '../constants/auth.constants';
import {
  LoginResponseDto,
  RegisterRequestDto,
  TokenPayload,
  UserInfoDto,
} from '../dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userSrv: UserService,
    private readonly jwtSrv: JwtService,
  ) { }

  async validateUser(email: string, password: string): Promise<User> {
    const user: User | null = await this.userSrv.findOneByEmail(email);
    if (!user) throw new BadRequestException(ERROR_USER_NOT_FOUND);

    assertIsUser(user);
    const match: boolean = bcrypt.compareSync(password, user.password);
    if (!match) throw new BadRequestException(ERROR_INVALID_CREDENTIALS);

    return user;
  }

  async login(validatedUser: User): Promise<LoginResponseDto> {
    const user: User | null = await this.userSrv.findOneByEmail(validatedUser.email);
    assertIsUser(user);
    const payload: TokenPayload = {
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
    const hashedPassword: string = bcrypt.hashSync(
      user.password,
      BCRYPT_HASH_SALT,
    );
    const newUser: IUser = {
      ...user,
      authProvider: AuthProvider.Local,
      password: hashedPassword,
      role: UserRole.Reader,
    };
    await this.userSrv.create(newUser);
    const createdUser: User | null = await this.userSrv.findOneByEmail(user.email);
    assertIsUser(createdUser);

    return this.login(createdUser);
  }

  async profile(loggedUser: User): Promise<User> {
    const user: User | null = await this.userSrv.findOneByEmail(loggedUser.email);
    assertIsUser(user);

    return user;
  }

  async changePassword(email: string, newPassword: string): Promise<void> {
    const hashedPassword: string = bcrypt.hashSync(newPassword, BCRYPT_HASH_SALT);
    await this.userSrv.updatePassword(email, hashedPassword);
  }
}
