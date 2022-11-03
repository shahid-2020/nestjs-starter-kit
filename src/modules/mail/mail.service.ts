import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

import { User } from '../user/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { SendMailContext, SendMailOptions } from './interfaces/mail.interface';

@Injectable()
export class MailService {
  private from: string;

  constructor(
    private mailService: MailerService,
    private configService: ConfigService,
  ) {
    this.from = this.configService.get('SENDER_EMAIL');
  }

  async sendMail(
    { from, to, subject, template }: SendMailOptions,
    context: SendMailContext,
  ): Promise<any> {
    try {
      const sentResponse = await this.mailService.sendMail({
        from: from,
        to: to,
        subject: subject,
        template: template,
        context,
      });
      return { sent: true, sentResponse };
    } catch (error: any) {
      return { sent: false, error: error?.message };
    }
  }

  async sendResetPasswordMail(user: User, url: string): Promise<any> {
    return this.sendMail(
      {
        from: this.from,
        to: user.email,
        subject: 'Forgot your password? (valid for only 10 minutes)',
        template: 'sample',
      },
      {
        subject: 'Resetting your password',
        header: 'Reset your password',
        name: `${user.firstName} ${user.lastName}`,
        url,
      },
    );
  }
}
