export interface ILoginBody {
	email: string;
	password: string;
}

export interface IResponse {
	statusCode: number;
	message: string;
	accessToken?: string;
}

export interface ILoginResponse extends IResponse {
	details: {
		name: string;
		email: string;
	};
}

export interface ISignUpBody extends ILoginBody {
	name: string;
}
