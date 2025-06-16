import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { UserService } from '../user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import JwtModuleConfig from 'src/config/modules-imports-config/jwt.config';
import { DatabaseModule } from 'src/config/database/database.module';
import { AuthService } from './services/auth.service';

@Module({
  imports: [JwtModule.registerAsync(JwtModuleConfig), DatabaseModule],
  controllers: [AuthController],
  providers: [AuthService, UserService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
