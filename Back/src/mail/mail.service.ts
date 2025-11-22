import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

import { Usuario } from 'generated/prisma';


@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendPasswordResetEmail(user: Usuario, token: string) { 
    
    const resetUrl = `http://localhost:3000/redefinit-senha?token=${token}`; // alterar para a url do front IMPORTANTE

    const emailHtml = `
      <p>Olá, ${user.nome || 'utilizador'},</p> 
      <p>Recebemos um pedido para redefinir a sua senha.</p>
      <p>Clique no link abaixo para criar uma nova senha:</p>
      <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;">Redefinir Senha</a>
      <p>Se não foi você que pediu, por favor ignore este email.</p>
      <p>Este link expira em 15 minutos.</p>
    `;

    await this.mailerService.sendMail({
      to: user.email, 
      subject: 'Recuperação de Senha',
      html: emailHtml,
    });
  }
}