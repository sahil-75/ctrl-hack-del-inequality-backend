import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Roles } from '../roles.enum';

export type UserDocument = User & Document;

@Schema()
export class User {
	@Prop({ required: true })
	name: string;

	@Prop({ required: true, unique: true })
	email: string;

	@Prop({ required: true })
	password: string;

	@Prop({ required: true })
	orgID: string;

	@Prop({ required: true })
	role: Roles;

	@Prop()
	totalBreaktime?: number;

	@Prop()
	isInBreakRoom?: boolean;

	@Prop()
	isInBreakMode?: boolean;

	@Prop()
	delegatee?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
