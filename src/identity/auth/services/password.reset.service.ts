import { randomBytes } from 'crypto';

import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PasswordResetLog } from '@prisma/client';
import { isDefined } from 'class-validator';
import { DatabaseService } from 'src/config/database/database.service';
import { isStringDefined } from 'src/shared/utils/common';
import { generateFullWebLink } from 'src/shared/utils/url.utils';

@Injectable()
export class PasswordResetService {
  constructor(
    private readonly prisma: DatabaseService,
    private readonly configSrv: ConfigService,
  ) { }

  async createResetToken(email: string): Promise<string> {
    // setting any previously generated token that has not been used to used
    await this.prisma.passwordResetLog.updateMany({
      where: {
        email,
        used: false,
      },
      data: {
        used: true,
      },
    });

    // create new token
    const token: string = randomBytes(32).toString();
    await this.prisma.passwordResetLog.create({
      data: {
        expiresAt: new Date(Date.now() + 900000),
        email,
        token,
      },
    });

    return token;
  }

  async validateAndConsumeToken(email: string, token: string): Promise<void> {
    const resetRequest: PasswordResetLog | null = await this.prisma.passwordResetLog.findFirst({
      where: {
        email,
        token,
        used: false,
        expiresAt: { gt: new Date() },
      },
    });

    if (!isDefined(resetRequest)) {
      throw new NotFoundException('Invalid or expired token');
    }

    await this.prisma.passwordResetLog.update({
      where: {
        id: resetRequest.id,
      },
      data: {
        used: true,
      },
    });
  }

  /**
   * Generates link to frontendBaseUri/auth/reset-password/token
   * @param token
   * @returns
   */
  public generateResetPasswordLink(token: string): string {
    const frontendBaseUri: string | undefined = this.configSrv.get<string>('frontend.baseUri');
    let fullWebLink: string = '';
    if (isStringDefined(frontendBaseUri)) {
      fullWebLink = generateFullWebLink(frontendBaseUri, [
        'auth',
        'reset-password',
        token,
      ]);
    }

    return fullWebLink;
  }
}
