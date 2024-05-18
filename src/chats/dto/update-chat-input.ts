import { Field, InputType, PartialType } from '@nestjs/graphql';
import { CreateChatInput } from './create-chat.input';
import { IsUUID } from 'class-validator';

@InputType()
export class UpdateChatInput extends PartialType(CreateChatInput) {
    @Field()
    @IsUUID()
    id: string;
}
