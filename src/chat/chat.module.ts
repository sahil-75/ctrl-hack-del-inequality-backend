import { Module } from '@nestjs/common';
import { ChatController } from './controllers/chat/chat.controller';
import { ChatService } from './services/chat/chat.service';
import { ChatRepository } from './repositories/chat/chat.repository';
import { Chat, ChatSchema } from './models/chat.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
		ConfigModule.forRoot(),
		JwtModule.register({
			secret: process.env.JWT_SECRET,
			signOptions: { expiresIn: '1h' },
		}),
		UserModule,
	],
	controllers: [ChatController],
	providers: [ChatService, ChatRepository],
})
export class ChatModule {}
