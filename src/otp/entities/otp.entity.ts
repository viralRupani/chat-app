import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { otp_type_enum } from 'src/common/enums';

@Entity()
@ObjectType()
export class Otp {
    @Field()
    @PrimaryColumn()
    otp: string;

    @Field(() => Int)
    @PrimaryColumn()
    user_id: number;

    @Field(() => otp_type_enum)
    @Column({
        type: 'enum',
        enum: otp_type_enum,
    })
    type: otp_type_enum;

    @Field()
    @CreateDateColumn()
    created_at?: Date;

    // Relations
    @ManyToOne(() => User, (user) => user.otps, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'user_id' })
    user: User;
}
