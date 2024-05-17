import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IPayload } from '../auth.interfaces';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';
import { Message } from 'src/common/constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly config: ConfigService,

        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.get('jwt.secret'),
        });
    }

    async validate(payload: IPayload) {
        try {
            await this.userRepo.findOneByOrFail({
                email: payload?.email,
                deleted_at: null,
            });
            return payload;
        } catch (error) {
            if (error instanceof EntityNotFoundError) {
                throw new UnauthorizedException(Message.USER_NOT_FOUND);
            } else {
                throw error;
            }
        }
    }
}
