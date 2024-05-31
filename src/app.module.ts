import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as joi from "joi";
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';

@Module({
    imports: [
        AuthModule,

        ConfigModule.forRoot({
            validationSchema: joi.object({
                JWT_SECRET: joi.string().required(),
                POSTGRES_DB: joi.string().required(),
                POSTGRES_HOST: joi.string().required(),
                POSTGRES_PASSWORD: joi.string().required(),
                POSTGRES_PORT: joi.number().required(),
                POSTGRES_USER: joi.string().required(),
            })
        }),

        DatabaseModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                database: configService.get('POSTGRES_DB'),
                host: configService.get('POSTGRES_HOST'),
                password: configService.get('POSTGRES_PASSWORD'),
                port: configService.get('POSTGRES_PORT'),
                user: configService.get('POSTGRES_USER'),
            }),
        }),

        UsersModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})

export class AppModule { }
