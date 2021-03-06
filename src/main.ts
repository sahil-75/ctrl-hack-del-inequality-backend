import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as morgan from 'morgan';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.enableCors();
	app.use(morgan('dev'));
	const PORT = process.env.PORT || 4000;
	await app.listen(PORT);
}
bootstrap();
