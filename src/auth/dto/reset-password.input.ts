import { Field, InputType, PickType } from '@nestjs/graphql';
import { Length } from 'class-validator';
import { RegisterUserInput } from './register-user.input';

@InputType()
export class ResetPasswordInput extends PickType(RegisterUserInput, [
    'password',
    'email',
] as const) {
    @Field()
    @Length(8, 8)
    otp: string;
}
