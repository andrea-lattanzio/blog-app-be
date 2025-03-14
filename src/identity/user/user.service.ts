import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/config/database/database.service';
import { User } from './user.interface';
import { randomBytes } from 'crypto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: DatabaseService) {}

  async create(user: User) {
    return await this.prisma.user.create({ data: user });
  }

  async findOneByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }

  async getUsername(name: string, lastname: string): Promise<string> {
    const baseUsername = `${name.toLowerCase().trim()}-${lastname.toLowerCase().trim()}`;
    let username = baseUsername;
    while (await this.usernameExists(username)) {
      username = this.addSuffix(baseUsername);
    }
    return username;
  }

  private async usernameExists(username: string): Promise<boolean> {
    const existingUser: User = await this.prisma.user.findUnique({
      where: { username },
    });
    return !!existingUser;
  }

  private addSuffix(baseUsername: string): string {
    return baseUsername + '-' + randomBytes(3).toString('hex');
  }
}
