import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/config/database/database.service';
import { User } from './user.interface';

@Injectable()
export class UserService {
  constructor(private readonly prisma: DatabaseService) {}

  async create(user: User) {
    return await this.prisma.user.create({ data: user });
  }

  async findOneByEmail(email: string) {
    return await this.prisma.user.findUniqueOrThrow({
      where: { email: email },
    });
  }
}
