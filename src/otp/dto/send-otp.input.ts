import { Field, InputType } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';
import { mail_subject_enum, otp_type_enum } from 'src/common/enums';

@InputType()
export class SendOtpInput {
    @Field(() => otp_type_enum)
    otp_type: otp_type_enum;

    @Field(() => mail_subject_enum)
    subject: mail_subject_enum;

    @Field()
    @IsEmail()
    to: string;
}
