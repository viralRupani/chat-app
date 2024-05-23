import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.input';
// import { UpdateMessageDto } from './dto/update-message.input';

@Injectable()
export class MessagesService {
    create(createMessageDto: CreateMessageDto) {
        console.log(createMessageDto);

        return 'This action adds a new message';
    }

    findAll() {
        return `This action returns all messages`;
    }

    findOne(id: number) {
        return `This action returns a #${id} message`;
    }

    // update(id: number, updateMessageDto: UpdateMessageDto) {
    //     return `This action updates a #${id} message`;
    // }

    remove(id: number) {
        return `This action removes a #${id} message`;
    }
}
