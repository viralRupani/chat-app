import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GenericResult {
    @Field()
    message: string;
}
