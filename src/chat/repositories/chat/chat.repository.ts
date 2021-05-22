import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Aggregate, Model } from 'mongoose';
import { IChatBody } from 'src/chat/chat.interface';
import { Chat, ChatDocument } from 'src/chat/models/chat.schema';

@Injectable()
export class ChatRepository {
	constructor(
		@InjectModel(Chat.name) private chatModel: Model<ChatDocument>
	) {}

	addMessage(chat: IChatBody, userId: string): Promise<ChatDocument> {
		const chatDoc = new this.chatModel({ ...chat, from: userId });
		return chatDoc.save();
	}

	getRecentMessages(userId: any): any {
		return this.chatModel.aggregate([
			{
				$match: {
					$or: [{ to: { $eq: userId } }, { from: { $eq: userId } }],
				},
			},
			{
				$sort: { timestamp: -1 },
			},
			{
				$project: {
					_id: 0,
					to: 1,
					from: 1,
					content: 1,
					timestamp: 1,
					groupId: {
						$cond: [{ $eq: [userId, '$from'] }, '$to', '$from'],
					},
				},
			},
			{
				$group: {
					_id: '$groupId',
					data: { $first: '$$ROOT' },
				},
			},
		]);
	}

	getMessageByUserID(
		userId: string,
		partnerId: string
	): Aggregate<ChatDocument[]> {
		return this.chatModel.aggregate([
			{
				$match: {
					$or: [
						{
							$and: [
								{ to: { $eq: userId } },
								{ from: { $eq: partnerId } },
							],
						},
						{
							$and: [
								{ to: { $eq: partnerId } },
								{ from: { $eq: userId } },
							],
						},
					],
				},
			},
		]);
	}
}
