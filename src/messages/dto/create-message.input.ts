import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';

@InputType()
export class CreateMessageDto {
    @Field()
    @IsNotEmpty()
    @IsString()
    @MaxLength(500)
    text: string;

    @Field()
    @IsUUID()
    created_by: string;

    @Field()
    @IsUUID()
    chat: string;
}
