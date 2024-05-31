import { Module } from '@nestjs/common';
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from '@nestjs/passport';
import { JwtUtility } from 'src/utils/jwt.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
    imports: [JwtModule, PassportModule],
    controllers: [AuthController],
    providers: [AuthService, JwtUtility],
})
export class AuthModule { }
