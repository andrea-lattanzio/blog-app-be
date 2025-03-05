import { BadRequestException, Injectable } from '@nestjs/common';
import { LoginResponseDto, RegisterRequestDto } from './dto/auth.dto';
import {
  BCRYPT_HASH_SALT,
  ERROR_EMAIL_EXISTS,
  ERROR_INVALID_CREDENTIALS,
  ERROR_USER_NOT_FOUND,
} from './constants/auth.constants';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from '../user/user.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userSrv: UserService,
    private readonly jwtSrv: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userSrv.findOneByEmail(email);
    if (!user) throw new BadRequestException(ERROR_USER_NOT_FOUND);
    const match = bcrypt.compareSync(password, user.password);
    if (!match) throw new BadRequestException(ERROR_INVALID_CREDENTIALS);
    return user;
  }

  async login(validatedUser: User): Promise<LoginResponseDto> {
    const user = {
      email: validatedUser.email,
    };
    const payload = {
      email: validatedUser.email,
      id: validatedUser.id,
    };
    return { token: await this.jwtSrv.signAsync(payload), user: user };
  }

  async register(user: RegisterRequestDto): Promise<LoginResponseDto> {
    const existingUser = await this.userSrv.findOneByEmail(user.email);
    if (existingUser) throw new BadRequestException(ERROR_EMAIL_EXISTS);
    const hashedPassword = await bcrypt.hashSync(
      user.password,
      BCRYPT_HASH_SALT,
    );
    const newUser: User = {
      ...user,
      authProvider: "Local",
      password: hashedPassword,
    };
    await this.userSrv.create(newUser);
    const createdUser = await this.userSrv.findOneByEmail(user.email);
    return this.login(createdUser);
  }

  async profile(user: User) {
    if (!user) return;
    return await this.userSrv.findOneByEmail(user.email);
  }
}
