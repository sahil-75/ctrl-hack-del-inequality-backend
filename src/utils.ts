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

export const verifyAndGetDomain = (
	email1: string,
	email2: string
): string | undefined => {
	const regexMail = /^.+@(\w+)\.\w+$/;
	const domain1 = email1.match(regexMail)?.[1];
	const domain2 = email2.match(regexMail)?.[1];
	return domain1 === domain2 ? domain1 : undefined;
};
