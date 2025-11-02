import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { UsuarioModule } from 'src/usuario/usuario.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from 'src/mail/mail.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  imports: [UsuarioModule, ConfigModule, MailModule, JwtModule.register({
     secret: process.env.JWT_SECRET,
     signOptions: { expiresIn: '30d'},
  })]
})
export class AuthModule {}
