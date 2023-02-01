import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import {CreateUserDto} from "./dto/create-user.dto";

@Controller('users')
export class UsersController {

    constructor( private usersService:  UsersService) {
    }

    @Post()
    create(@Body() userDto: CreateUserDto){
        return this.usersService.createUser(userDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    getAll(){
        return this.usersService.getAllUsers();
    }

}
