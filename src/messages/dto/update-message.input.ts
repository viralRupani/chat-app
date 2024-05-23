import { PartialType } from '@nestjs/mapped-types';
import { CreateMessageDto } from './create-message.input';
import { InputType } from '@nestjs/graphql';

@InputType()
export class UpdateMessageDto extends PartialType(CreateMessageDto) {
    id: number;
}
