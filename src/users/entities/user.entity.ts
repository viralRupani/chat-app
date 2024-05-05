import { ObjectType, Field, Int } from '@nestjs/graphql';
import { CommonEntity } from 'src/common/common-entities/common.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Otp } from '../../otp/entities/otp.entity';

@ObjectType()
@Entity()
export class User extends CommonEntity {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id: number;

    @Field(() => String)
    @Column()
    name: string;

    @Field()
    @Column({ type: 'varchar', length: 100 })
    about: string;

    @Field(() => String)
    @Column({ type: 'numeric' })
    phone: string;

    @Field()
    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Field({ nullable: true })
    @Column({ default: false })
    is_verified: boolean;

    // Relations
    @OneToMany(() => Otp, (otp) => otp.user)
    otps: Otp[];
}