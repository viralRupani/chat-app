import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { RegisterUserInput } from './dto/register-user.input';
import { User } from 'src/users/entities/user.entity';
import { GenericResult } from 'src/common/generic-result.output';
import { Message } from 'src/common/constants';
import { OtpService } from 'src/otp/otp.service';
import { mail_subject_enum, otp_type_enum } from 'src/common/enums';
import { UseGuards } from '@nestjs/common';
import { LoginUserInput } from './dto/login-user.input';
import { LocalAuthGuard } from 'src/common/guards/local-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { LoginOutput } from './output/login.output';
import { SkipAuth } from 'src/common/decorators/skip-auth.decorator';
import { ChangePasswordInput } from './dto/change-password.input';
import { ForgotPasswordInput } from './dto/forgot-password.input';
import { ResetPasswordInput } from './dto/reset-password.input';
import { ActivateAccountInput } from './dto/activate-account.input';

@Resolver(() => User)
export class AuthResolver {
    constructor(
        private readonly authService: AuthService,
        private readonly otpService: OtpService,
    ) {}

    @SkipAuth()
    @Mutation(() => GenericResult)
    async register(
        @Args('object') registerUserInput: RegisterUserInput,
    ): Promise<GenericResult> {
        try {
            await this.authService.register(registerUserInput);
            await this.otpService.sendOtp({
                to: registerUserInput.email,
                subject: mail_subject_enum.register_otp,
                otp_type: otp_type_enum.register_user,
            });

            return {
                message: Message.OTP_SENT,
            };
        } catch (err) {
            throw err;
        }
    }

    @SkipAuth()
    @Mutation(() => GenericResult)
    async activateAccount(
        @Args('object') activateAccountInput: ActivateAccountInput,
    ): Promise<GenericResult> {
        const isVerified: boolean = await this.otpService.verifyOtp({
            email: activateAccountInput.email,
            otp: activateAccountInput.otp,
            otp_type: otp_type_enum.register_user,
        });

        isVerified &&
            (await this.authService.activateAccount(activateAccountInput));

        return {
            message: Message.OTP_VERIFIED,
        };
    }

    @SkipAuth()
    @UseGuards(LocalAuthGuard)
    @Query(() => LoginOutput)
    async login(
        @CurrentUser() user: User,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        @Args('object') _: LoginUserInput,
    ) {
        return this.authService.login(user);
    }

    @Mutation(() => GenericResult)
    async changePassword(
        @CurrentUser() currentUser: User,
        @Args('object') changePassInput: ChangePasswordInput,
    ) {
        return await this.authService.changePassword(
            changePassInput,
            currentUser,
        );
    }

    @SkipAuth()
    @Mutation(() => GenericResult)
    async forgotPassword(
        @Args('object') forgotPasswordInput: ForgotPasswordInput,
    ): Promise<GenericResult> {
        await this.otpService.sendOtp({
            otp_type: otp_type_enum.forgot_password,
            subject: mail_subject_enum.forgot_pass_otp,
            to: forgotPasswordInput.email,
        });

        return {
            message: Message.OTP_SENT,
        };
    }

    @SkipAuth()
    @Mutation(() => GenericResult)
    async resetPassword(
        @Args('object') resetPasswordInput: ResetPasswordInput,
    ): Promise<GenericResult> {
        const isVerified: boolean = await this.otpService.verifyOtp({
            email: resetPasswordInput.email,
            otp: resetPasswordInput.otp,
            otp_type: otp_type_enum.forgot_password,
        });
        isVerified &&
            (await this.authService.resetPassword(resetPasswordInput));
        return {
            message: Message.PASS_CHANGED,
        };
    }
}
