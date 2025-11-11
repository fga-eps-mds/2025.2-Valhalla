import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';

@Module({
  imports: [ ConfigModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: config.get<string>('MAIL_HOST'), 
          port: config.get<number>('MAIL_PORT'), 
          secure: false, 
          auth: {
            user: config.get<string>('MAIL_USER'), 
            pass: config.get<string>('MAIL_PASS'), 
          },
        },
        defaults: {
          from: `"Não Responda" <${config.get<string>('MAIL_FROM')}>`,
        },
      }),
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}