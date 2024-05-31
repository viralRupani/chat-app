import {
    WebSocketGateway,
    SubscribeMessage,
    MessageBody,
    WebSocketServer,
    WsResponse,
    WsException,
} from '@nestjs/websockets';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.input';
import { Server } from 'net';

@WebSocketGateway()
export class MessagesGateway {
    @WebSocketServer() server: Server;

    constructor(private readonly messagesService: MessagesService) {}

    @SubscribeMessage('message:create')
    async create(
        @MessageBody() createMessageDto: CreateMessageDto,
    ): Promise<WsResponse<unknown>> {
        //todo: dto not validating
        try {
            await this.messagesService.create(createMessageDto);
            return { event: 'message:create', data: createMessageDto };
        } catch (error) {
            throw new WsException(error);
        }
    }
}
