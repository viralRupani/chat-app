import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { RegisterUserInput } from './dto/register-user.input';
import { User } from 'src/users/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Message } from 'src/common/constants';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginOutput } from './output/login.output';
import { IPayload } from './auth.interfaces';
import { GenericResult } from 'src/common/generic-result.output';
import { ChangePasswordInput } from './dto/change-password.input';
import { ResetPasswordInput } from './dto/reset-password.input';
import { ActivateAccountInput } from './dto/activate-account.input';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly dataSource: DataSource,
        private readonly config: ConfigService,
        private readonly httpService: HttpService,

        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ) {}

    async validateUser(email: string, password: string) {
        try {
            const foundUser: User = await this.usersService.findUser(email);
            if (await bcrypt.compare(password, foundUser.password)) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { password, ...result } = foundUser;
                return result;
            }
            return null;
        } catch (err) {
            if (err instanceof NotFoundException) {
                return null;
            } else {
                throw err;
            }
        }
    }

    async register(registerUserInput: RegisterUserInput): Promise<void> {
        const { email, password } = registerUserInput;

        await firstValueFrom(
            this.httpService.get(`https://${email.split('@')[1]}`).pipe(
                catchError(() => {
                    throw new BadRequestException(Message.INVALID_EMAIL);
                }),
            ),
        );

        const foundUser: User = (
            await this.dataSource.query(
                `
            SELECT * FROM "user"
            WHERE "user"."email" = $1 AND "user"."is_verified" = $2
        `,
                [email, true],
            )
        )[0];

        if (!foundUser) {
            registerUserInput.password = await bcrypt.hash(
                password,
                this.config.get('bcrypt.hash'),
            );

            await this.userRepo
                .createQueryBuilder()
                .insert()
                .into(User)
                .values({ created_at: new Date(), ...registerUserInput })
                .orUpdate(['name', 'password', 'about', 'phone'], ['email'])
                .execute();
        } else {
            throw new ConflictException(Message.USER_ALREADY_EXIST);
        }
    }

    async activateAccount({
        email,
        otp_type,
    }: ActivateAccountInput): Promise<void> {
        await this.dataSource.transaction(async (entityManager) => {
            await entityManager.query(
                'UPDATE "user" SET is_verified = $1 WHERE email = $2',
                [true, email],
            );
            await entityManager.query(
                `
                DELETE FROM
                    "otp"
                USING
                    "user"
                WHERE
                    "otp"."user_id" = "user"."id"
                AND
                    "otp"."type"::text = $1::text
                AND
                    "user"."email" = $2;`,
                [otp_type, email],
            );
        });
    }

    login(user: User): LoginOutput {
        const payload: IPayload = { email: user.email, sub: user.id };
        return {
            message: Message.LOGGED_IN,
            access_token: this.jwtService.sign(payload),
        };
    }

    async changePassword(
        { password, new_password }: ChangePasswordInput,
        currentUser: User,
    ): Promise<GenericResult> {
        if (password === new_password) {
            throw new BadRequestException(Message.SAME_PASSWORD);
        }

        const foundUser: User = await this.usersService.findUser(
            currentUser.email,
        );

        if (!(await bcrypt.compare(password, foundUser.password))) {
            throw new UnauthorizedException(Message.WRONG_PASS);
        }

        const hash: string = await bcrypt.hash(
            new_password,
            this.config.get('bcrypt.hash'),
        );

        await this.dataSource.query(
            `
            UPDATE "user"
            SET "password" = $1
            WHERE "email" = $2
        `,
            [hash, foundUser.email],
        );

        return {
            message: Message.PASS_CHANGED,
        };
    }

    async resetPassword({ email, password }: ResetPasswordInput) {
        const foundUser: User = await this.usersService.findUser(email);

        if (!foundUser) {
            throw new NotFoundException(Message.USER_NOT_FOUND);
        }

        const hash: string = await bcrypt.hash(password, 10);

        await this.dataSource.query(
            `
            UPDATE "user"
            SET "password" = $1
            WHERE "email" = $2
        `,
            [hash, email],
        );
    }
}
