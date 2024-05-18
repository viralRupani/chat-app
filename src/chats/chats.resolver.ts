import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ChatsService } from './chats.service';
import { Chat } from './entities/chat.entity';
import { CreateChatInput } from './dto/create-chat.input';
import { GenericResult } from 'src/common/generic-result.output';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { IPayload } from 'src/auth/auth.interfaces';
import { UpdateChatInput } from './dto/update-chat-input';
import { DeleteChatInput } from './dto/delete-chat-input';
import { GetChatInput } from './dto/get-chat.input';
import { GetChatOutput } from './dto/get-chat.output';

@Resolver(() => Chat)
export class ChatsResolver {
    constructor(private readonly chatsService: ChatsService) {}

    @Query(() => GetChatOutput)
    async getChats(@Args('object') getChatInput: GetChatInput) {
        return await this.chatsService.getChats(getChatInput);
    }

    @Mutation(() => GenericResult)
    async createChat(
        @Args('object') createChatInput: CreateChatInput,
        @CurrentUser() user: IPayload,
    ): Promise<GenericResult> {
        try {
            return await this.chatsService.createChat(createChatInput, user);
        } catch (err) {
            throw err;
        }
    }

    @Mutation(() => GenericResult)
    async updateChat(
        @Args('object') updateChatInput: UpdateChatInput,
    ): Promise<GenericResult> {
        return await this.chatsService.updateChat(updateChatInput);
    }

    @Mutation(() => GenericResult)
    async deleteChat(@Args('object') deleteChatInput: DeleteChatInput) {
        return await this.chatsService.deleteChat(deleteChatInput);
    }
}
