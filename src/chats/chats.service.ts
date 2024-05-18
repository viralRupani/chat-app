import {
    BadRequestException,
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

@Injectable()
export class ChatsService {
    constructor(private readonly dataSource: DataSource) {}

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
                    ...createChatInput.members.map(
                        (member): ChatUserMapping => {
                            return {
                                chat_id: chatId,
                                created_at: new Date(),
                                user_id: member,
                                role: role_type_enum.member,
                            };
                        },
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
}
