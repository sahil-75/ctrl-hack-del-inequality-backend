import {
	Body,
	Controller,
	Get,
	Param,
	Post,
	Req,
	UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { IChatBody, IChatResponse } from 'src/chat/chat.interface';
import { ChatService } from 'src/chat/services/chat/chat.service';

@Controller('chat')
export class ChatController {
	constructor(private chatService: ChatService) {}

	@UseGuards(AuthGuard)
	@Post()
	sendMessage(
		@Body() body: IChatBody,
		@Req() req: Request
	): Promise<IChatResponse> {
		return this.chatService.addMessage(body, (req as any).userId);
	}

	@UseGuards(AuthGuard)
	@Get('recent')
	getRecentMessages(@Req() req: Request): any {
		return this.chatService.getRecentMessages((req as any).userId);
	}

	@UseGuards(AuthGuard)
	@Get('messages/:partnerId')
	getMessagesByUser(
		@Req() req: Request,
		@Param('partnerId') partnerId: string
	): any {
		return this.chatService.getMessageByUserID(
			(req as any).userId,
			partnerId
		);
	}
}
