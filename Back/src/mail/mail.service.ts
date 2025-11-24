import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Usuario } from '@prisma/client';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendPasswordResetEmail(user: Usuario, token: string) {

    const frontendUrl = this.configService.get<string>('FRONT_URL') || 'http://localhost:3000';
    
    const resetUrl = `${frontendUrl}/redefinit-senha?token=${token}`;

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3060BF;">Guardiões da Universidade</h2>
        <p>Olá, <strong>${user.nome}</strong>,</p> 
        <p>Recebemos um pedido para redefinir a sua senha.</p>
        <p>Clique no botão abaixo para criar uma nova senha:</p>
        <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #3060BF; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Redefinir Minha Senha</a>
        </div>
        <p style="font-size: 12px; color: #666;">Se não foi você que pediu, por favor ignore este email.</p>
        <p style="font-size: 12px; color: #666;">Este link expira em 15 minutos.</p>
      </div>
    `;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Recuperação de Senha - Guardiões',
      html: emailHtml,
    });
  }
}