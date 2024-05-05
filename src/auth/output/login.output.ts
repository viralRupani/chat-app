import { Field, ObjectType, PickType } from '@nestjs/graphql';
import { GenericResult } from 'src/common/generic-result.output';

@ObjectType()
export class LoginOutput extends PickType(GenericResult, ['message'] as const) {
    @Field()
    access_token: string;
}
