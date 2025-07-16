import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { isStringDefined } from 'src/shared/utils/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    const authSecret: string | undefined = configService.get('auth.secret');
    if (!isStringDefined(authSecret)) throw new Error('Jwt secret not defind');
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: authSecret,
    });
  }

  /* eslint-disable */
  async validate(payload: string) {
    return payload;
  }
}
