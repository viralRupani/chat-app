import { Field, InputType, PickType } from '@nestjs/graphql';
import { RegisterUserInput } from '../../auth/dto/register-user.input';
import { Length } from 'class-validator';

@InputType()
export class ActivateAccountInput extends PickType(RegisterUserInput, [
    'email',
]) {
    @Field()
    @Length(8, 8)
    otp: string;
}
