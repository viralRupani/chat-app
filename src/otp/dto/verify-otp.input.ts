import { Field, InputType, PickType } from '@nestjs/graphql';
import { RegisterUserInput } from '../../auth/dto/register-user.input';
import { Length } from 'class-validator';
import { otp_type_enum } from 'src/common/enums';

@InputType()
export class VerifyOtpInput extends PickType(RegisterUserInput, ['email']) {
    @Field()
    @Length(8, 8)
    otp: string;

    @Field(() => otp_type_enum)
    otp_type: otp_type_enum;
}
