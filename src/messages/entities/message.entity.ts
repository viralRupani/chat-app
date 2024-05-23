import { Chat } from 'src/chats/entities/chat.entity';
import { CommonEntity } from 'src/common/common-entities/common.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Message extends CommonEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 500 })
    text: string;

    // Relations
    @ManyToOne(() => User, (user) => user.messages)
    created_by: User;

    @ManyToOne(() => Chat, (chat) => chat.messages)
    chat: Chat;
}
