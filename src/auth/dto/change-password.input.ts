import { Field, InputType, PickType } from '@nestjs/graphql';
import { IsStrongPassword } from 'class-validator';
import { LoginUserInput } from './login-user.input';

@InputType()
export class ChangePasswordInput extends PickType(LoginUserInput, [
    'password',
] as const) {
    @Field()
    @IsStrongPassword()
    new_password: string;
}
