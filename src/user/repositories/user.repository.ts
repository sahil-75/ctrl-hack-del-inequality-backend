import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LeanDocument, Model } from 'mongoose';
import { User, UserDocument } from '../models/user.schema';
import { Roles } from '../roles.enum';

@Injectable()
export class UserRepository {
	constructor(
		@InjectModel(User.name) private userModel: Model<UserDocument>
	) {}

	addUser(
		email: string,
		name: string,
		password: string,
		role: Roles,
		orgID: string
	): Promise<UserDocument> {
		const user = new this.userModel({
			email,
			name,
			password,
			role,
			orgID,
		});
		return user.save();
	}

	findUserByEmail(email: string): Promise<LeanDocument<UserDocument>> {
		return this.userModel.findOne({ email }).lean().exec();
	}

	findUser(): Promise<LeanDocument<UserDocument[]>> {
		return this.userModel.find({}).exec();
	}

	findUserByEmailNonLean(email: string): Promise<UserDocument> {
		return this.userModel.findOne({ email }).exec();
	}

	findUserByID(id: string): Promise<LeanDocument<UserDocument>> {
		return this.userModel.findById(id).lean().exec();
	}
}
