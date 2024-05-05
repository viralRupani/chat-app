import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';

@ObjectType()
@Entity()
export class CommonEntity {
    @Field()
    @Column({ type: 'timestamp' })
    created_at: Date;

    @Field({ nullable: true })
    @Column({ type: 'timestamp', nullable: true })
    updated_at?: Date;

    @Field({ nullable: true })
    @Column({ type: 'timestamp', nullable: true })
    deleted_at?: Date;
}
