import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from 'node:crypto';
import { VerifyOtpInput } from 'src/otp/dto/verify-otp.input';
import { mail_template_enum } from 'src/common/enums';
import { EmailService } from 'src/email/email.service';
import { Otp } from 'src/otp/entities/otp.entity';
import { User } from 'src/users/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { SendOtpInput } from './dto/send-otp.input';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OtpService {
    constructor(
        @InjectRepository(Otp)
        private readonly otpRepo: Repository<Otp>,

        @InjectRepository(User)
        private readonly userRepo: Repository<User>,

        private readonly dataSource: DataSource,

        private readonly emailService: EmailService,
    ) {}

    private generateRandomOtp(): Promise<string> {
        return new Promise((resolve) => {
            resolve(
                String(
                    parseInt(crypto.randomBytes(4).toString('hex'), 16),
                ).slice(-8),
            );
        });
    }

    async sendOtp({ to, subject, otp_type }: SendOtpInput): Promise<void> {
        const foundUser: User = await this.userRepo.findOne({
            where: {
                email: to,
            },
        });

        if (foundUser) {
            const otp: string = await this.generateRandomOtp();
            await this.dataSource.transaction(async (entityManager) => {
                await entityManager.delete(Otp, {
                    type: otp_type,
                    user: foundUser,
                } as Otp);
                await entityManager.insert(Otp, {
                    otp,
                    created_at: new Date(),
                    type: otp_type,
                    user: foundUser,
                });
            });

            if (false) {
                // todo: make mail environment wise.
                await this.emailService.sendOtp({
                    to,
                    subject,
                    template: mail_template_enum.send_otp,
                    context: {
                        otp,
                    },
                });
            }
        }
        return;
    }

    async verifyOtp({
        email,
        otp_type,
        otp,
    }: VerifyOtpInput): Promise<boolean> {
        const foundOtp: Otp = await this.otpRepo
            .createQueryBuilder('otp')
            .leftJoin('otp.user', 'user')
            .where('otp.type = :otp_type', { otp_type })
            .andWhere('otp.otp = :otp', { otp })
            .andWhere('user.email = :email', { email })
            .getOne(); // todo: add 3 minutes of validation;

        if (!foundOtp) {
            return false;
        } else {
            return true;
        }
    }
}
