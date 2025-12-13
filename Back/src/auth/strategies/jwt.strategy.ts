import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsuarioPayload } from '../models/usuarioPayload';
import { UsuarioFromJwt } from '../models/Usuariofromjwt';
import { ConfigService } from '@nestjs/config';



@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || '',
})
}

  async validate(payload: UsuarioPayload) {
    return {
      id: payload.sub,
      email: payload.email,
      tipo: payload.tipo,
    };
  }
}