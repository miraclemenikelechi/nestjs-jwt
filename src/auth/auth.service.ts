import { ConflictException, HttpStatus, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
import { tokenExpiresInDate } from 'src/app.constants';
import { CustomResponse } from 'src/app.response';
import { databaseSchema } from 'src/database/database.schema';
import { DatabaseService } from 'src/database/database.service';
import { createInDatabase, existsInDatabase } from 'src/utils/crud.database';
import { comparePassword, hashPassword } from 'src/utils/hash.password';
import { JwtUtility } from 'src/utils/jwt.service';
import { AuthBaseDto } from './auth.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly jwtService: JwtUtility
    ) { }

    db = this.databaseService.database;

    /**
     * Signs up a new user by checking if the user already exists,
     * hashing the password, and saving the user to the database.
     * 
     * @param {AuthBaseDto} body - The data transfer object containing email and password.
     * @param {Request} req - The Express request object.
     * @param {Response} res - The Express response object.
     * @returns {Promise<Response>} - The HTTP response with the created user data.
     * @throws {ConflictException} - If the user already exists in the database.
     */
    async signup(body: AuthBaseDto, req: Request, res: Response): responseT {
        const { email, password } = body;

        // check if user exists
        const userExists: boolean = await existsInDatabase({
            column: 'email',
            database: this.db,
            table: databaseSchema.users,
            value: email
        });

        // if user exists, throw error
        if (userExists) throw new ConflictException('User already exists');

        // hash the password
        const hashedPassword = await hashPassword(password, 12);

        // create user in database
        const user = await createInDatabase({
            database: this.db,
            table: databaseSchema.users,
            values: { email, password: hashedPassword }
        });

        // create and return response
        const response = CustomResponse({
            data: {
                id: user.id as string,
                email: user.email as string,
            },
            message: "user created",
            path: req.path,
            statusCode: HttpStatus.CREATED
        });
        return res.status(response.statusCode).json(response);
    }

    /**
     * Signs in a user by validating credentials and generating a JWT token.
     * 
     * @param {AuthBaseDto} body - The data transfer object containing email and password.
     * @param {Request} req - The Express request object.
     * @param {Response} res - The Express response object.
     * @returns {Promise<Response>} - The HTTP response with the JWT token.
     * @throws {UnauthorizedException} - If the credentials are invalid.
     * @throws {InternalServerErrorException} - If the token generation fails.
     */
    async signin(body: AuthBaseDto, req: Request, res: Response): responseT {
        const { email, password } = body;

        // check if user exists
        const userExists: any = await existsInDatabase({
            column: 'email',
            database: this.db,
            table: databaseSchema.users,
            value: email
        });

        // if user does not exist, throw error
        if (!userExists) throw new UnauthorizedException('Invalid credentials');

        // get user details from database
        const { id: userId, email: userEmail, password: userPassword } = userExists;

        // compare passwords
        const isMatch = await comparePassword(password, userPassword as string);

        // if passwords do not match, throw error
        if (!isMatch) throw new UnauthorizedException('Invalid credentials');

        // generate JWT token
        const payload = { id: userId, email: userEmail };
        const token = await this.jwtService.sign(payload);

        // if token is not generated, throw error
        if (!token) throw new InternalServerErrorException('Failed to generate token');

        // set JWT token in cookie
        res.cookie('user_credentials', token, {
            httpOnly: true,
            secure: true,
            expires: tokenExpiresInDate,
        });

        // set jwt in headers
        res.setHeader('Authorization', `Bearer ${token}`);

        // create and return response
        const response = CustomResponse({
            data: token,
            message: "user logged in",
            path: req.path,
            statusCode: HttpStatus.OK
        });
        return res.status(response.statusCode).json(response);
    }

    /**
     * Signs out a user by clearing the authentication cookie and removing the authorization header.
     * 
     * @param {Request} req - The Express request object.
     * @param {Response} res - The Express response object.
     * @returns {Promise<Response>} - The HTTP response confirming the user has been logged out.
     */
    async signout(req: Request, res: Response): responseT {
        res.clearCookie('user_credentials'); // clear jwt token in cookie
        res.setHeader('Authorization', ``); // clear jwt token in headers

        // create and return response
        const response = CustomResponse({
            data: null,
            message: "user logged out",
            path: req.path,
            statusCode: HttpStatus.OK
        });
        return res.status(response.statusCode).json(response);
    }
}

type responseT = Promise<Response<any, Record<string, any>>>;
