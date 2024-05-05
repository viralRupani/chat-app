import { InputType, PickType } from '@nestjs/graphql';
import { LoginUserInput } from './login-user.input';

@InputType()
export class ForgotPasswordInput extends PickType(LoginUserInput, [
    'email',
] as const) {}
