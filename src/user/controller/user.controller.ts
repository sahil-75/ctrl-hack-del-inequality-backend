import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { ILoginBody, IResponse, ISignUpBody } from '../user.inteface';

@Controller('user')
export class UserController {
	constructor(private userService: UserService) {}

	@Post('login')
	@HttpCode(HttpStatus.OK)
	loginUser(@Body() body: ILoginBody) {
		return this.userService.login(body.email, body.password);
	}

	@Post('signup')
	createUser(@Body() body: ISignUpBody): Promise<IResponse> {
		return this.userService.createUser(body);
	}
}
