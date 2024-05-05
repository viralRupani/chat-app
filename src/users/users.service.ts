import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { Message } from 'src/common/constants';

@Injectable()
export class UsersService {
    constructor(private readonly dataSource: DataSource) {}

    async findUser(email: string): Promise<User> {
        const foundUser: User = (
            await this.dataSource.query(
                `SELECT * FROM "user" WHERE "user"."email" = $1`,
                [email],
            )
        )[0];

        if (!foundUser) {
            throw new NotFoundException(Message.USER_NOT_FOUND);
        }

        return foundUser;
    }
}
