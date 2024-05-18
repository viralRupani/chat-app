import { InputType, PickType } from '@nestjs/graphql';
import { UpdateChatInput } from './update-chat-input';

@InputType()
export class DeleteChatInput extends PickType(UpdateChatInput, [
    'id',
] as const) {}
