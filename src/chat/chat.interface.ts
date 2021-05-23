export interface IChat {
	to: string;
	content: string;
}

export interface IChatBody extends IChat {
	isUrgent?: boolean;
	toDelegatee?: boolean;
	accessToken: string;
}

export interface IChatResponse extends IChat {
	from: string;
	timestamp: Date;
	toEmail?: string;
}
