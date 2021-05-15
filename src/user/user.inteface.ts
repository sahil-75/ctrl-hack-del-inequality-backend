import { LeanDocument } from 'mongoose';
import { UserDocument } from './models/user.schema';
import { Roles } from './roles.enum';

export interface ILoginBody {
	email: string;
	password: string;
}

export interface CommonResponse {
	statusCode: number;
	message: string;
}

export interface IResponse extends CommonResponse {
	accessToken?: string;
}

export interface ILoginResponse extends IResponse {
	details: {
		name: string;
		email: string;
	};
}

export interface ISignUpBody extends ILoginBody {
	name: string;
	role: Roles;
}

export interface IUsersResponse extends CommonResponse {
	users: LeanDocument<UserDocument[]>;
}

export interface IUpdateUser {
	name?: string;
	email: string;
	password?: string;
	role?: Roles;
}
