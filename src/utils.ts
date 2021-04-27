import { HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

export const throwHttpException = (status: HttpStatus, error: string) => {
	throw new HttpException(
		{
			status,
			error,
		},
		status
	);
};

export const compareWithHash = (encrypted: string, original: string) =>
	bcrypt.compare(original, encrypted);

export const generateHash = (original: string) => bcrypt.hash(original, 3);
