import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
        origin: ['http://localhost:5000'],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        allowedHeaders: 'Content-Type, Authorization',
        credentials: true,
    });

    const config = new DocumentBuilder()
        .setTitle('Movie Booker API')
        .setDescription('API for booking movies')
        .setVersion('1.0')
        .addBearerAuth({
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'Token',
        })
        .build();

    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, documentFactory);

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
        }),
    );
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
