import { Field, InputType, PartialType } from '@nestjs/graphql';
import {
    GenericFindInput,
    id_comparison_exp,
    string_comparison_exp,
} from 'src/common/dto/generic.inputs';

@InputType()
class findChatWhere {
    @Field(() => id_comparison_exp, { nullable: true })
    id?: id_comparison_exp;

    @Field(() => string_comparison_exp, { nullable: true })
    name?: string_comparison_exp;
}

@InputType()
export class GetChatInput extends PartialType(GenericFindInput) {
    @Field({ nullable: true })
    where?: findChatWhere;
}
