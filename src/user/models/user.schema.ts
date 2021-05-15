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
}

export const UserSchema = SchemaFactory.createForClass(User);
