import { Field, InputType } from '@nestjs/graphql';
import { LoginUserInput } from './login-user.input';
import { Length } from 'class-validator';

@InputType()
export class ResetPasswordInput extends LoginUserInput {
    @Field()
    @Length(8, 8)
    otp: string;
}
