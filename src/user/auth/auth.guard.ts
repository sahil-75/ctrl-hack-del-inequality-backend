import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private jwtService: JwtService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const req = context.getArgByIndex(0);
		const {
			body: { accessToken },
		} = req;
		try {
			const user = await this.jwtService.verifyAsync(accessToken);
			req.userId = user.id;
			return true;
		} catch (err) {
			return false;
		}
	}
}
