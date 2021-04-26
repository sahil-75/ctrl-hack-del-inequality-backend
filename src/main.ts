import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.enableCors();
	const PORT = process.env.port || 4000;
	await app.listen(PORT);
}
bootstrap();
