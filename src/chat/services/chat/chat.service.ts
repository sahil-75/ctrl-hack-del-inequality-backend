import { BadRequestException, Injectable } from '@nestjs/common';
import { Aggregate } from 'mongoose';
import { IChatBody, IChatResponse } from 'src/chat/chat.interface';
import { ChatRepository } from 'src/chat/repositories/chat/chat.repository';
import { UserDocument } from 'src/user/models/user.schema';
import { UserService } from 'src/user/services/user.service';

@Injectable()
export class ChatService {
	constructor(
		private chatRepository: ChatRepository,
		private userService: UserService
	) {}

	async addMessage(
		body: IChatBody,
		userId: string,
		socket: any
	): Promise<IChatResponse> {
		const user = await this.userService.getUserById(userId);
		const toDetails = await this.userService.getUserById(body.to);
		if (!toDetails) {
			throw new BadRequestException('User Not Found!');
		}

		if (body.toDelegatee) {
			if (!user.delegatee) {
				throw new BadRequestException('No Delegatee for user found!');
			}
			return this.addMessage(
				{
					content: body.content,
					to: user.delegatee,
					accessToken: body.accessToken,
				},
				userId,
				socket
			);
		}

		if (toDetails.isInBreakMode && !body.isUrgent) {
			throw new BadRequestException('User In Break Mode');
		}

		const message = await this.chatRepository.addMessage(body, userId);

		socket.server.emit('chatMessage', message);

		return {
			content: message.content,
			to: message.to,
			from: message.from,
			timestamp: message.timestamp,
			toEmail: toDetails.email,
		};
	}

	async getRecentMessages(userId: any): Promise<any> {
		const chats = await this.chatRepository.getRecentMessages(userId);
		const users: UserDocument[] = await Promise.all(
			chats.map(({ _id }) => this.userService.getUserById(_id))
		);
		return chats.map((chat, index) => {
			const { name, email, id } = users[index];
			return {
				partner: {
					name,
					email,
					id,
				},
				...chat.data,
			};
		});
	}

	getMessageByUserID(
		userId: string,
		partnerId: string
	): Aggregate<IChatResponse[]> {
		return this.chatRepository.getMessageByUserID(userId, partnerId);
	}
}
