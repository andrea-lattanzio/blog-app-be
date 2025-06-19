import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'crypto';
import { DatabaseService } from 'src/config/database/database.service';
import { generateFullWebLink } from 'src/shared/utils/url.utils';

@Injectable()
export class PasswordResetService {
  constructor(
    private readonly prisma: DatabaseService,
    private readonly configSrv: ConfigService,
  ) {}

  async createResetToken(email: string): Promise<string> {
    // setting any previously generated token that has not been used to used
    await this.prisma.passwordResetLog.updateMany({
      where: {
        email,
        used: false
      },
      data: {
        used: true
      }
    });

    // create new token
    const token: string = randomBytes(32).toString();
    await this.prisma.passwordResetLog.create({
      data: {
        expiresAt: new Date(Date.now() + 900000),
        email,
        token,
      }
    });

    return token;
  }

  async validateAndConsumeToken(email: string, token: string): Promise<void> {
  }

  /**
   * Generates link to frontendBaseUri/auth/reset-password/token
   * @param token
   * @returns
   */
  public generateResetPasswordLink(token: string): string {
    return generateFullWebLink(this.configSrv.get<string>('frontend.baseUri'), [
      'auth',
      'reset-password',
      token,
    ]);
  }
}
