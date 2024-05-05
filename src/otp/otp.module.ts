import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { EmailModule } from 'src/email/email.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Otp } from 'src/otp/entities/otp.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User, Otp]), EmailModule],
    providers: [OtpService],
    exports: [OtpService],
})
export class OtpModule {}
