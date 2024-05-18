import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AggregateOutput {
    @Field()
    count: number;
}
