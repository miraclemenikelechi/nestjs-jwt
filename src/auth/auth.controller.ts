import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { ResponseMessage } from 'src/app.response';
import { AuthBaseDto } from './auth.dto';
import { AuthService } from './auth.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    /**
    * Signs up a new user.
    * 
    * Params:
    * - `body {AuthBaseDto}`: The data transfer object containing email and password.
    * 
    * Returns:
    * - `201 {Promise<Response>}`: The HTTP response with the created user data.
    * 
    * @param {AuthBaseDto} body - The data transfer object containing email and password.
    * @param {Request} req - The Express request object.
    * @param {Response} res - The Express response object.
    * @returns {Promise<Response>} - The HTTP response with the created user data.
    */
    @Post("signup")
    // @ResponseMessage('User created') // custom response message for interceptor
    signup(@Body() body: AuthBaseDto, @Req() req: Request, @Res() res: Response) {
        return this.authService.signup(body, req, res);
    }

    /**
    * Signs in an existing user.
    * 
    * Params:
    * - `body {AuthBaseDto}`: The data transfer object containing email and password.
    * 
    * Returns:
    * - `200 {Promise<Response>}`: The HTTP response with the JWT token.
    * 
    * @param {AuthBaseDto} body - The data transfer object containing email and password.
    * @param {Request} req - The Express request object.
    * @param {Response} res - The Express response object.
    * @returns {Promise<Response>} - The HTTP response with the JWT token.
    */
    @Post("signin")
    @ResponseMessage('User logged in')
    signin(@Body() body: AuthBaseDto, @Req() req: Request, @Res() res: Response) {
        return this.authService.signin(body, req, res);
    }

    /**
     * Signs out the current user.
     * 
     * Returns:
     * - `200 {Promise<Response>}`: The HTTP response confirming the user has been logged out.
     * 
     * @param {Request} req - The Express request object.
     * @param {Response} res - The Express response object.
     * @returns {Promise<Response>} - The HTTP response confirming the user has been logged out.
 */
    @Get("signout")
    signout(@Req() req: Request, @Res() res: Response) {
        return this.authService.signout(req, res);
    }
}
