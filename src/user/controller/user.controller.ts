import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { UserService } from '../services/user.service';
import {
	ILoginBody,
	ILoginResponse,
	IResponse,
	ISignUpBody,
} from '../user.inteface';
import * as bcrypt from 'bcrypt';
import { throwHttpException } from 'src/utils';
import { JwtService } from '@nestjs/jwt';
import { USER_CONST } from '../user.contants';

@Controller('user')
export class UserController {
	constructor(
		private userService: UserService,
		private jwtService: JwtService,
	) {}

	@Post('login')
	async loginUser(@Body() body: ILoginBody): Promise<ILoginResponse> {
		const { email, password } = body;

		if (!email || !password) {
			throwHttpException(
				HttpStatus.NOT_ACCEPTABLE,
				USER_CONST.EMAIL_PASS_REQUIRED,
			);
		}

		const user = await this.userService.findUserByEmail(email);

		if (!user) {
			throwHttpException(HttpStatus.NOT_FOUND, USER_CONST.NO_USER);
		}

		const isCorrectUser = await bcrypt.compare(password, user.password);
		if (!isCorrectUser) {
			throwHttpException(
				HttpStatus.FORBIDDEN,
				USER_CONST.INVALID_CREDENTIAL,
			);
		}

		const token = this.jwtService.sign({
			id: user.id,
		});

		return {
			status: HttpStatus.OK,
			message: USER_CONST.LOGIN_SUCCESS,
			accessToken: token,
			name: user.name,
			email: user.email,
		};
	}

	@Post('signup')
	async createUser(@Body() body: ISignUpBody): Promise<IResponse> {
		const { email, password, name } = body;

		if (!email || !password || !name) {
			throwHttpException(
				HttpStatus.NOT_ACCEPTABLE,
				USER_CONST.EMAIL_PASS_NAME_REQUIRED,
			);
		}

		const hashedPassword = await bcrypt.hash(password, 3);

		try {
			await this.userService.addUser(email, name, hashedPassword);
		} catch (err) {
			throwHttpException(HttpStatus.BAD_REQUEST, USER_CONST.EMAIL_EXISTS);
		}

		return {
			status: HttpStatus.OK,
			message: USER_CONST.OPERATION_SUCCESS,
		};
	}
}
