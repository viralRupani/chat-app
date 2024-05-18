import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';
import { chat_type_enum } from 'src/common/enums';

@InputType()
export class CreateChatInput {
    @Field()
    @IsNotEmpty()
    name: string;

    @Field({ nullable: true })
    @IsString()
    @MaxLength(200)
    description: string;

    @Field()
    @IsString()
    profile: string;

    @Field(() => chat_type_enum)
    chat_type: chat_type_enum;

    @Field(() => [String])
    @IsUUID('all', { each: true })
    members: string[];
}
