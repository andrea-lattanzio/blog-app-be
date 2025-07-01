import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/config/database/database.service';
import { User } from './user.interface';
import { randomBytes } from 'crypto';
import { UserInfoDto } from '../auth/dto/auth.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: DatabaseService) { }

  async create(user: User) {
    return await this.prisma.user.create({ data: user });
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
        password: hashedPassword
      }
    })
  }

  async findOneByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }
}
