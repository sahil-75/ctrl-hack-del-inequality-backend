import {
	Get,
	Post,
	Put,
	Req,
	Body,
	Controller,
	HttpCode,
	UseGuards,
	HttpStatus,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import {
	ILoginBody,
	IResponse,
	ISignUpBody,
	IUpdateUser,
} from '../user.inteface';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';

@Controller('user')
export class UserController {
	constructor(private userService: UserService) {}

	@Post('login')
	@HttpCode(HttpStatus.OK)
	loginUser(@Body() body: ILoginBody) {
		return this.userService.login(body.email, body.password);
	}

	@UseGuards(AuthGuard)
	@Post('signup')
	createUser(
		@Body() body: ISignUpBody,
		@Req() req: Request
	): Promise<IResponse> {
		return this.userService.createUser(body, (req as any).userId);
	}

	@UseGuards(AuthGuard)
	@Get()
	getUsers(@Req() req: Request): Promise<IResponse> {
		return this.userService.getUsers((req as any).userId);
	}

	@UseGuards(AuthGuard)
	@Put()
	@HttpCode(HttpStatus.OK)
	updateUser(
		@Body() body: IUpdateUser,
		@Req() req: Request
	): Promise<IResponse> {
		return this.userService.updateUser(body, (req as any).userId);
	}
}
