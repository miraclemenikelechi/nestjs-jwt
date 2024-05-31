import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { tokenExpiresInSeconds, tokenSecret } from 'src/app.constants';

@Injectable()
export class JwtUtility {

    constructor(private readonly jwtService: JwtService) { }

    // sign JWT payload
    public sign(payload: Record<string, any>): Promise<string> {
        return this.jwtService.signAsync(payload, {
            secret: tokenSecret,
            expiresIn: tokenExpiresInSeconds,
            algorithm: "HS256"
        });
    }

    // verify JWT token
    public verify(token: string): Record<string, any> {
        try {
            return this.jwtService.verify(token);
        } catch (error) {
            // throw error if token is invalid
            throw new Error('Invalid token');
        }
    }

}