import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsUUID } from 'class-validator';

@InputType()
export class GenericFindInput {
    @Field({ defaultValue: 0 })
    offset: number;

    @Field({ defaultValue: 20 })
    limit: number;
}

@InputType()
export class id_comparison_exp {
    @Field()
    @IsUUID()
    _eq: string;
}

@InputType()
export class string_comparison_exp {
    @Field({ nullable: true })
    @IsString()
    _eq: string;

    @Field({ nullable: true })
    @IsString()
    _ilike: string;
}
