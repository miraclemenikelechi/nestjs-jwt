import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    /**
     * Retrieves all users from the database.
     * 
     * @returns {Promise<any[]>} - A promise that resolves to an array of user objects.
     */
    @Get()
    async findAll() {
        return this.usersService.findAll();
    }

    /**
     * Retrieves a single user from the database by ID.
     * 
     * This route is protected by JWT authentication.
     * 
     * @param {string} id - The ID of the user to retrieve.
     * @param {Request} req - The Express request object.
     * @returns {Promise<any>} - A promise that resolves to the user object if found.
     */
    @UseGuards(JwtAuthGuard) // this protects a particular route
    @Get(":id")
    async findOne(@Param('id') id: string, @Req() req: Request) {
        return this.usersService.findOne(id, req);
    }
}
