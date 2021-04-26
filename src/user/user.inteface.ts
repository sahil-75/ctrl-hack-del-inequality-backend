export interface ILoginBody {
	email: string;
	password: string;
}

export interface IResponse {
	status: number;
	message: string;
	accessToken?: string;
}

export interface ILoginResponse extends IResponse {
	name: string;
	email: string;
}

export interface ISignUpBody extends ILoginBody {
	name: string;
}
