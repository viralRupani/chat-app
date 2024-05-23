import {
    WebSocketGateway,
    SubscribeMessage,
    MessageBody,
    WebSocketServer,
} from '@nestjs/websockets';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.input';
import { UpdateMessageDto } from './dto/update-message.input';
import { Server } from 'net';

@WebSocketGateway()
export class MessagesGateway {
    @WebSocketServer() server: Server;

    constructor(private readonly messagesService: MessagesService) {}

    @SubscribeMessage('createMessage')
    create(@MessageBody() createMessageDto: CreateMessageDto) {
        return this.messagesService.create(createMessageDto);
    }

    @SubscribeMessage('findAllMessages')
    findAll() {
        return this.messagesService.findAll();
    }
    @SubscribeMessage('findOneMessage')
    findOne(@MessageBody() id: number) {
        return this.messagesService.findOne(id);
    }

    @SubscribeMessage('updateMessage')
    update(@MessageBody() updateMessageDto: UpdateMessageDto) {
        return this.messagesService.update(
            updateMessageDto.id,
            updateMessageDto,
        );
    }

    @SubscribeMessage('removeMessage')
    remove(@MessageBody() id: number) {
        return this.messagesService.remove(id);
    }
}
