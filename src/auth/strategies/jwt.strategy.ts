import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(req) => req?.cookies?.authToken]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('SECRET_KEY'), 
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email }; 
  }
}
