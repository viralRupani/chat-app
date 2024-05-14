import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, MaxLength } from 'class-validator';
import { chat_type_enum } from 'src/common/enums';

@InputType()
export class CreateChatInput {
    @Field()
    @IsNotEmpty()
    name: string;

    @Field({ nullable: true })
    @MaxLength(200)
    description: string;

    @Field()
    profile: string;

    @Field(() => chat_type_enum)
    chat_type: chat_type_enum;

    @Field(() => [Int])
    members: number[];
}
