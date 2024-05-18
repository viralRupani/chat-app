import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import { DataSource, EntityNotFoundError } from 'typeorm';
import { Chat } from './entities/chat.entity';
import { CreateChatInput } from './dto/create-chat.input';
import { GenericResult } from 'src/common/generic-result.output';
import { User } from 'src/users/entities/user.entity';
import { ChatUserMapping } from './entities/chat_user_mapping.entity';
import { role_type_enum } from 'src/common/enums';
import { Message } from 'src/common/constants';
import { IPayload } from 'src/auth/auth.interfaces';
import { UpdateChatInput } from './dto/update-chat-input';
import { DeleteChatInput } from './dto/delete-chat-input';
import { GetChatInput } from './dto/get-chat.input';
import { GetChatOutput } from './dto/get-chat.output';

@Injectable()
export class ChatsService {
    constructor(private readonly dataSource: DataSource) {}

    async getChats(
        getChatInput: GetChatInput,
        user: IPayload,
    ): Promise<GetChatOutput> {
        const { offset, limit, where } = getChatInput;

        const queryBuilder = this.dataSource
            .getRepository(Chat)
            .createQueryBuilder('chat')
            .offset(offset)
            .limit(limit)
            .andWhere('chat.deleted_at IS NULL');

        if (where) {
            const { id, name } = where;
            if (id) {
                const { _eq } = id;
                if (_eq) {
                    queryBuilder.andWhere('chat.id = :id', { id: _eq });
                }
            }

            if (name) {
                const { _eq, _ilike } = name;
                if (_eq) {
                    queryBuilder.andWhere('chat.name = :name', { name: _eq });
                } else if (_ilike) {
                    queryBuilder.andWhere('chat.name ILIKE :name', {
                        name: _ilike,
                    });
                }
            }
        }

        queryBuilder
            .leftJoin('chat.chat_user_mapping', 'cum')
            .andWhere('cum.user_id = :user_id', { user_id: user.sub });

        const [chats, count] = await queryBuilder.getManyAndCount();

        return {
            chats,
            chats_aggregate: {
                count,
            },
        };
    }

    async createChat(
        createChatInput: CreateChatInput,
        user: IPayload,
    ): Promise<GenericResult> {
        try {
            const foundUser: User =
                await this.dataSource.manager.findOneByOrFail(User, {
                    id: user.sub,
                });

            await this.dataSource.transaction(async (entityManager) => {
                const response = await entityManager.insert(Chat, [
                    {
                        ...createChatInput,
                        created_at: new Date(),
                        created_by: foundUser,
                    },
                ]);

                const chatId: string = response.identifiers[0]?.id;

                await entityManager.insert(ChatUserMapping, [
                    {
                        chat_id: chatId,
                        created_at: new Date(),
                        user_id: foundUser.id,
                        role: role_type_enum.admin,
                    },
                    ...createChatInput.members.reduce(
                        (acc: ChatUserMapping[], cur: string) => {
                            if (cur !== foundUser.id) {
                                acc.push({
                                    chat_id: chatId,
                                    created_at: new Date(),
                                    user_id: cur,
                                    role: role_type_enum.member,
                                });
                            }
                            return acc;
                        },
                        [],
                    ),
                ]);
            });
            return {
                message: Message.CHAT_CREATED,
            };
        } catch (err) {
            if (err instanceof EntityNotFoundError) {
                throw new BadRequestException(err.message);
            } else {
                throw new InternalServerErrorException(
                    err?.message ?? Message.SOMETHING_WENT_WRONG,
                );
            }
        }
    }

    async updateChat(
        updateChatInput: UpdateChatInput,
        user: IPayload,
    ): Promise<GenericResult> {
        const { id, ...rest } = updateChatInput;

        const isAuthorized = await this.dataSource.query(
            `
        SELECT 1
        FROM chat_user_mapping
        WHERE user_id = $1
        AND chat_id = $2
        AND role = 'admin'
        AND deleted_at IS NULL;
        `,
            [user.sub, id],
        );

        if (isAuthorized.length === 0) {
            throw new ForbiddenException(Message.UNAUTHORIZED_OPERATION);
        }

        await this.dataSource
            .createQueryBuilder()
            .update(Chat)
            .set({ ...rest, updated_at: new Date() } as Chat)
            .where('id = :id', { id })
            .execute();

        return {
            message: Message.CHAT_UPDATED,
        };
    }

    async deleteChat(
        { id }: DeleteChatInput,
        user: IPayload,
    ): Promise<GenericResult> {
        const isAuthorized = await this.dataSource.query(
            `
        SELECT 1
        FROM chat_user_mapping
        WHERE user_id = $1
        AND chat_id = $2
        AND role = 'admin'
        AND deleted_at IS NULL;
    `,
            [user.sub, id],
        );

        if (isAuthorized.length === 0) {
            throw new ForbiddenException(Message.UNAUTHORIZED_OPERATION);
        }

        await this.dataSource.query(
            `
                UPDATE
                    chat c
                SET
                    deleted_at = NOW()
                WHERE
                    c.id = $1
                    AND c.deleted_at IS NULL;
        `,
            [id],
        );

        return {
            message: Message.CHAT_DELETED,
        };
    }
}
