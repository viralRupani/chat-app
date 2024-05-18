import { Field, ObjectType } from '@nestjs/graphql';
import { Chat } from '../entities/chat.entity';
import { AggregateOutput } from 'src/common/dto/generic.output';

@ObjectType()
export class GetChatOutput {
    @Field(() => [Chat])
    chats: Chat[];

    @Field(() => AggregateOutput)
    chats_aggregate: AggregateOutput;
}
