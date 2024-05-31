import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.input';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageEntity } from './entities/message.entity';
import { Chat } from 'src/chats/entities/chat.entity';
import { User } from 'src/users/entities/user.entity';
import { Message } from 'src/common/constants';
import { ChatUserMapping } from 'src/chats/entities/chat_user_mapping.entity';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class MessagesService {
    constructor(
        @InjectRepository(MessageEntity)
        private readonly messageRepo: Repository<MessageEntity>,
        @InjectRepository(Chat)
        private readonly chatRepo: Repository<Chat>,
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        @InjectRepository(ChatUserMapping)
        private readonly chatUserMappingRepo: Repository<ChatUserMapping>,
    ) {}

    async create(createMessageDto: CreateMessageDto): Promise<void> {
        console.log(createMessageDto);
        try {
            const foundChat = await this.chatRepo.findOneBy({
                id: createMessageDto.chat,
                deleted_at: null,
            });

            const foundUser = await this.userRepo.findOneBy({
                id: createMessageDto.created_by,
                is_verified: true,
                deleted_at: null,
            });

            if (!foundChat || !foundUser) {
                throw new WsException({
                    status: 'error',
                    message: Message.MESSAGE_SOURCE_NOT_FOUND,
                });
            }

            const chatUserMapping = await this.chatUserMappingRepo
                .createQueryBuilder('chatUserMapping')
                .where('chat_id = :chat_id', { chat_id: createMessageDto.chat })
                .andWhere('user_id = :user_id', {
                    user_id: createMessageDto.created_by,
                })
                .getOne();

            if (!chatUserMapping) {
                throw new WsException({
                    status: 'error',
                    message: Message.ACCESS_DENIED,
                });
            }

            await this.messageRepo.insert({
                created_by: foundUser,
                created_at: new Date(),
                chat: foundChat,
                text: createMessageDto.text,
            });
        } catch (error) {
            throw error;
        }
    }
}
