import {
	BadRequestException,
	HttpStatus,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LeanDocument } from 'mongoose';
import { compareWithHash, generateHash } from 'src/utils';
import { UserDocument } from '../models/user.schema';
import { UserRepository } from '../repositories/user.repository';
import { USER_CONST } from '../user.contants';
import { ILoginResponse, IResponse, ISignUpBody } from '../user.inteface';

@Injectable()
export class UserService {
	constructor(
		private jwtService: JwtService,
		private userRepository: UserRepository
	) {}

	async createUser({
		name,
		email,
		password,
	}: ISignUpBody): Promise<IResponse> {
		const hashedPassword = await generateHash(password);
		try {
			await this.userRepository.addUser(email, name, hashedPassword);
		} catch {
			throw new BadRequestException(USER_CONST.EMAIL_EXISTS);
		}

		return {
			status: HttpStatus.CREATED,
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
		const token = await this.generateJWTToken({ id: user.id });
		return {
			name: user.name,
			email: user.email,
			status: HttpStatus.OK,
			message: USER_CONST.LOGIN_SUCCESS,
			accessToken: token,
		};
	}

	async generateJWTToken(payload: any): Promise<string> {
		return this.jwtService.sign(payload);
	}
}
