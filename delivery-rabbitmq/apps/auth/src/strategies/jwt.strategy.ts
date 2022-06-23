import { ConfigService } from '@nestjs/config';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt, VerifiedCallback } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { Payload } from '../interfaces/payload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService, private config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get<string>('JWT_KEY'),
    });
  }

  async validate(payload: Payload, done: VerifiedCallback) {
    const user = await this.authService.validarUsuario(payload);
    if (!user) {
      return done(
        new HttpException('Acesso negado', HttpStatus.UNAUTHORIZED),
        false,
      );
    }
    return done(null, user, payload.iat);
  }
}
