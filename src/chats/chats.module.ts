import { Module } from '@nestjs/common';
import { ChatsResolver } from './chats.resolver';
import { ChatsService } from './chats.service';

@Module({
    providers: [ChatsResolver, ChatsService],
})
export class ChatsModule {}
