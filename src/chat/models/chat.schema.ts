import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ChatDocument = Chat & Document;

@Schema()
export class Chat {
	@Prop({ required: true })
	from: string;

	@Prop({ required: true })
	to: string;

	@Prop({ required: true })
	content: string;

	@Prop({ type: Date, required: true, default: Date.now })
	timestamp: Date;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
