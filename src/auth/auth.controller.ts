import {Body, Controller, HttpException, Post} from "@nestjs/common";
import { AuthService } from "./auth.service";
import {CreateUserDto} from "../users/dto/create-user.dto";

@Controller('/auth')
export class AuthController{

    constructor(private authService: AuthService) {

    }

    @Post('/validate')
    async validateAccount(@Body() mail:string, accessCode:string): Promise<{ token: string }>{
        const res = await this.authService.validateAccount(mail, accessCode)
         if(!res.codeEquals){
             throw new HttpException('invalid codhee', 400)
         }
         return await this.authService.generateToken(res.user)
    }

    @Post('/login')
    async login(@Body() userDto: CreateUserDto): Promise<{token :string}>{
        return await this.authService.login(userDto)
    }

    @Post('/registration')
    async registration(@Body() userDto: CreateUserDto){
        return await this.authService.registration(userDto)
    }
}