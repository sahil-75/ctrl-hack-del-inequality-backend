export interface IChat {
	to: string;
	content: string;
}

export interface IChatBody extends IChat {
	accessToken: string;
}

export interface IChatResponse extends IChat {
	from: string;
	timestamp: Date;
}
