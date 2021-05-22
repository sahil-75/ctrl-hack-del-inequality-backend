import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AppGateway } from './app.gateway';
import { ChatModule } from './chat/chat.module';
import { AuthModule } from './auth/auth.module';
@Module({
	imports: [
		ConfigModule.forRoot(),
		MongooseModule.forRoot(
			`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@ctrl-hack-del-inequalit.scfcm.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
			{
				useNewUrlParser: true,
				useUnifiedTopology: true,
			}
		),
		UserModule,
		ChatModule,
		AuthModule,
	],
	providers: [AppGateway],
})
export class AppModule {}
