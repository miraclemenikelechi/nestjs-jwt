import { ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './app.response';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const reflector = new Reflector();

    // globals
    app.setGlobalPrefix('api/v1');
    app.useGlobalInterceptors(new ResponseInterceptor(reflector));
    app.useGlobalPipes(new ValidationPipe());

    // swagger config
    const options = new DocumentBuilder()
        .setTitle('NestJs JWT')
        .setDescription('learning JWT authentication with NestJs')
        .setVersion('1.0')
        .addOAuth2()
        .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('docs', app, document);

    // middlewares
    app.use(cookieParser());

    // cors
    app.enableCors();

    // set port
    const PORT = process.env.PORT || 8000;
    await app.listen(PORT);
}
bootstrap();
