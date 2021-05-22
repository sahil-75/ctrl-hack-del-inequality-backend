import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private jwtService: JwtService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const req: Request = context.getArgByIndex(0);
		try {
			const accessToken = req.headers.authorization.match(
				/Bearer (.+)/
			)[1];
			const user = await this.jwtService.verifyAsync(accessToken);
			req['userId'] = user.id;
			return true;
		} catch (err) {
			return false;
		}
	}
}
