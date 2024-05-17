import { User } from 'src/users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Chat } from './chat.entity';
import { role_type_enum } from 'src/common/enums';
import { CommonEntity } from 'src/common/common-entities/common.entity';

@Entity()
export class ChatUserMapping extends CommonEntity {
    @PrimaryColumn()
    user_id: number;

    @PrimaryColumn()
    chat_id: number;

    @ManyToOne(() => User, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'user_id' })
    user?: User;

    @ManyToOne(() => Chat, (chat) => chat.chat_user_mapping, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'chat_id' })
    chat?: Chat;

    @Column({
        type: 'enum',
        enum: role_type_enum,
        default: role_type_enum.member,
    })
    role: role_type_enum;
}
