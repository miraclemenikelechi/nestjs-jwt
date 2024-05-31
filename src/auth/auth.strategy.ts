import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { tokenSecret } from "src/app.constants";
import { UserAuthPayload } from "./auth.entity";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                ExtractJwt.fromAuthHeaderAsBearerToken(), // extract token from header
                JwtStrategy.extractTokenFromCookies // extract token from cookies
            ]),
            ignoreExpiration: false,
            secretOrKey: tokenSecret
        });
    }

    private static extractTokenFromCookies(request: Request): string | null {
        if (!request?.cookies?.user_credentials) return null;

        return request.cookies.user_credentials;
    }

    async validate(payload: { id: string, email: string; }): Promise<UserAuthPayload> {
        return payload;
    }
}