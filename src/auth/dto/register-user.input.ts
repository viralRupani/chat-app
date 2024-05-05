import { Field, InputType } from '@nestjs/graphql';
import {
    IsEmail,
    IsNotEmpty,
    IsPhoneNumber,
    IsString,
    IsStrongPassword,
    MaxLength,
} from 'class-validator';
import { Entity } from 'typeorm';

@InputType()
@Entity()
export class RegisterUserInput {
    @Field(() => String)
    @IsNotEmpty()
    @IsString()
    name: string;

    @Field()
    @IsString()
    @MaxLength(100)
    about: string;

    @Field(() => String)
    @IsPhoneNumber('IN')
    phone: string;

    @Field()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @Field()
    @IsStrongPassword()
    password: string;
}
