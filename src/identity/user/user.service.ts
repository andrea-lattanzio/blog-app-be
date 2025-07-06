import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/config/database/database.service';

import { UserInfoDto } from '../auth/dto/auth.dto';

import { User } from './user.interface';

@Injectable()
export class UserService {
  constructor(private readonly prisma: DatabaseService) { }

  async create(user: User) {
    return this.prisma.user.create({ data: user });
  }

  /**
   *
   * @param id The article id.
   * @returns The deleted article.
   */
  async remove(id: string): Promise<UserInfoDto> {
    const deletedUser = await this.prisma.user.delete({
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

  async findOneByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }
}
