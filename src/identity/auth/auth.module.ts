import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { DatabaseService } from 'src/config/database/database.service';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import JwtModuleConfig from 'src/config/modules-imports-config/jwt.config';

@Module({
  imports: [JwtModule.registerAsync(JwtModuleConfig)],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    DatabaseService,
    LocalStrategy,
    JwtStrategy,
  ],
})
export class AuthModule {}
