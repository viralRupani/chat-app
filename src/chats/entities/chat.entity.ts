import { Field, ObjectType } from '@nestjs/graphql';
import { CommonEntity } from 'src/common/common-entities/common.entity';
import { chat_type_enum } from 'src/common/enums';
import { User } from 'src/users/entities/user.entity';
import {
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { ChatUserMapping } from './chat_user_mapping.entity';
import { MessageEntity } from 'src/messages/entities/message.entity';

@Entity()
@ObjectType()
export class Chat extends CommonEntity {
    @PrimaryGeneratedColumn('uuid')
    @Field()
    id?: string;

    @Column({ type: 'varchar', length: 50 })
    @Field()
    name: string;

    @Column({ type: 'varchar', length: 200 })
    @Field()
    description: string;

    @Column({ unique: true })
    @Field()
    profile: string;

    @Column({
        type: 'enum',
        enum: chat_type_enum,
        default: chat_type_enum.direct_message,
    })
    @Field({ defaultValue: chat_type_enum.direct_message })
    chat_type: chat_type_enum;

    @ManyToOne(() => User)
    created_by: User;

    @OneToMany(() => ChatUserMapping, (chatUserMapping) => chatUserMapping.chat)
    chat_user_mapping: ChatUserMapping[];

    @OneToMany(() => MessageEntity, (message) => message.chat)
    messages: MessageEntity;
}
