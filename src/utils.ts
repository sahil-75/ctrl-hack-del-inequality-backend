import { HttpException, HttpStatus } from '@nestjs/common';

export const throwHttpException = (status: HttpStatus, error: string) => {
	throw new HttpException(
		{
			status,
			error,
		},
		status,
	);
};
