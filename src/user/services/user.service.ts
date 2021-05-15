import {
	BadRequestException,
	HttpStatus,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LeanDocument } from 'mongoose';
import { compareWithHash, generateHash, verifyAndGetDomain } from 'src/utils';
import { UserDocument } from '../models/user.schema';
import { UserRepository } from '../repositories/user.repository';
import { USER_CONST } from '../user.contants';
import {
	IUsersResponse,
	ILoginResponse,
	IResponse,
	ISignUpBody,
	IUpdateUser,
} from '../user.inteface';

@Injectable()
export class UserService {
	constructor(
		private jwtService: JwtService,
		private userRepository: UserRepository
	) {}

	async getUsers({}): Promise<IUsersResponse> {
		try {
			const users = await this.userRepository.findUser();

			return {
				statusCode: HttpStatus.CREATED,
				message: USER_CONST.OPERATION_SUCCESS,
				users,
			};
		} catch {
			throw new BadRequestException(USER_CONST.EMAIL_EXISTS);
		}
	}

	async createUser(body: ISignUpBody, adminId: string): Promise<IResponse> {
		const { name, email, password, role } = body;
		const hashedPassword = await generateHash(password);
		const admin = await this.userRepository.findUserByID(adminId);
		const orgID = verifyAndGetDomain(admin.email, email);
		if (!orgID) {
			throw new BadRequestException(USER_CONST.MUST_BE_SAME_ORG);
		}
		try {
			await this.userRepository.addUser(
				email,
				name,
				hashedPassword,
				role,
				orgID
			);
		} catch {
			throw new BadRequestException();
		}

		return {
			statusCode: HttpStatus.CREATED,
			message: USER_CONST.OPERATION_SUCCESS,
		};
	}

	async login(email: string, password: string): Promise<ILoginResponse> {
		const user = await this.userRepository.findUserByEmail(email);
		if (!user) {
			throw new BadRequestException(USER_CONST.NO_USER);
		}
		return this.verifyUser(user, password);
	}

	async verifyUser(
		user: LeanDocument<UserDocument>,
		password: string
	): Promise<ILoginResponse> {
		const isCorrectPassword = await compareWithHash(
			user.password,
			password
		);
		if (!isCorrectPassword) {
			throw new UnauthorizedException();
		}
		const token = await this.generateJWTToken({ id: user._id });
		return {
			statusCode: HttpStatus.OK,
			message: USER_CONST.LOGIN_SUCCESS,
			accessToken: token,
			details: {
				name: user.name,
				email: user.email,
			},
		};
	}

	async updateUser({
		email,
		name,
		password,
		role,
	}: IUpdateUser): Promise<IResponse> {
		const user = await this.userRepository.findUserByEmailNonLean(email);
		name && (user.name = name);
		role && (user.role = role);
		password && (user.password = await generateHash(password));
		try {
			await user.save();
		} catch (err) {
			console.error(err);
			throw new BadRequestException();
		}
		return {
			statusCode: HttpStatus.OK,
			message: USER_CONST.OPERATION_SUCCESS,
		};
	}

	async generateJWTToken(payload: any): Promise<string> {
		return this.jwtService.sign(payload);
	}
}
