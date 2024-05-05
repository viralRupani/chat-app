import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Message } from 'src/common/constants';

@Injectable()
export class EmailService {
    constructor(private readonly mailerService: MailerService) {}

    async sendOtp(options: ISendMailOptions) {
        try {
            await this.mailerService.sendMail({
                ...options,
            });
        } catch (err) {
            throw new InternalServerErrorException(Message.MAIL_ERR);
        }
    }
}
