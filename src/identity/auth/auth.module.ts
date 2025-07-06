import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from 'src/config/database/database.module';
import JwtModuleConfig from 'src/config/modules-imports-config/jwt.config';
import { MailSenderModule } from 'src/mailer/mailer.module';

import { UserService } from '../user/user.service';

import { AuthController } from './controllers/auth.controller';
import { PasswordResetController } from './controllers/password.reset.controller';
import { AuthService } from './services/auth.service';
import { PasswordResetService } from './services/password.reset.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [JwtModule.registerAsync(JwtModuleConfig), DatabaseModule, MailSenderModule],
  controllers: [AuthController, PasswordResetController],
  providers: [
    AuthService,
    UserService,
    LocalStrategy,
    JwtStrategy,
    PasswordResetService,
  ],
})
export class AuthModule {}
