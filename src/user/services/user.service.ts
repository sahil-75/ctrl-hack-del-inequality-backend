import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../models/user.schema';

@Injectable()
export class UserService {
	constructor(
		@InjectModel(User.name) private userModel: Model<UserDocument>,
	) {}

	findUserByEmail(email: string): Promise<UserDocument> {
		return this.userModel.findOne({ email }).exec();
	}

	addUser(
		email: string,
		name: string,
		password: string,
	): Promise<UserDocument> {
		const user = new this.userModel({
			email,
			name,
			password,
		});
		return user.save();
	}
}
