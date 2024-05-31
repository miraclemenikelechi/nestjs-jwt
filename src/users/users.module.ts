import { Module } from '@nestjs/common';
import { JwtStrategy } from 'src/auth/auth.strategy';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
    controllers: [UsersController],
    providers: [UsersService, JwtStrategy],
})
export class UsersModule { }
