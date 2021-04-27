import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LeanDocument, Model } from 'mongoose';
import { User, UserDocument } from '../models/user.schema';

@Injectable()
export class UserRepository {
	constructor(
		@InjectModel(User.name) private userModel: Model<UserDocument>
	) {}

	addUser(
		email: string,
		name: string,
		password: string
	): Promise<UserDocument> {
		const user = new this.userModel({
			email,
			name,
			password,
		});
		return user.save();
	}

	findUserByEmail(email: string): Promise<LeanDocument<UserDocument>> {
		return this.userModel.findOne({ email }).lean().exec();
	}
}
