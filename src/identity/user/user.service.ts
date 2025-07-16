import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { DatabaseService } from 'src/config/database/database.service';

import { UserInfoDto } from '../auth/dto/auth.dto';

import { User as IUser } from './user.interface';

@Injectable()
export class UserService {
  constructor(private readonly prisma: DatabaseService) { }

  async create(user: IUser): Promise<UserInfoDto> {
    const createdUser: User = await this.prisma.user.create({ data: user });

    return new UserInfoDto(createdUser);
  }

  /**
   *
   * @param id The article id.
   * @returns The deleted article.
   */
  async remove(id: string): Promise<UserInfoDto> {
    const deletedUser: User = await this.prisma.user.delete({
      where: { id },
    });

    return new UserInfoDto(deletedUser);
  }

  async updatePassword(email: string, hashedPassword: string): Promise<void> {
    await this.prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
      },
    });
  }

  async findOneByEmail(email: string): Promise<User | null> {
    const user: User | null = await this.prisma.user.findUnique({
      where: { email },
    });

    if (user) return user;

    return null;
  }
}
