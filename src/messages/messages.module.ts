import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesGateway } from './messages.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageEntity } from './entities/message.entity';
import { Chat } from 'src/chats/entities/chat.entity';
import { User } from 'src/users/entities/user.entity';
import { ChatUserMapping } from 'src/chats/entities/chat_user_mapping.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([MessageEntity, Chat, User, ChatUserMapping]),
    ],
    providers: [MessagesGateway, MessagesService],
})
export class MessagesModule {}
