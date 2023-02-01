import {Body, HttpException, HttpStatus, Injectable, Post, UnauthorizedException} from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcryptjs'
import { User } from "../users/user.model";
import {CreateUserDto, ModifyUserDto} from "../users/dto/create-user.dto";
import * as SendGrid from '@sendgrid/mail'
import {content} from "../users/utils";

@Injectable()
export class AuthService {
    constructor(private userService: UsersService, private jwtService:JwtService) {
        SendGrid.setApiKey(process.env.SENDGRID_API_KEY);
    }

    async login( userDto: CreateUserDto){
        const user = await this.validateUser(userDto)

        return this.generateToken(user)

    }

    async registration( userDto: CreateUserDto) {
        const candidate = await this.userService.getUserByMail(userDto.mail)

        if (candidate) {
            throw new HttpException('This email already taken', HttpStatus.BAD_REQUEST)
        }
        const hashPassword = await bcrypt.hash(userDto.password, 5)

        const user = await this.userService.createUser({...userDto, password: hashPassword})
        await user.save()
        const send = await this.sendMail(userDto.mail)

    }


     async generateToken(user: User){
        const payload = {mail: user.mail,id: user.id }
        return{
            token:this.jwtService.sign(payload)
        }
    }

    private async validateUser(userDto: CreateUserDto){
        const user = await this.userService.getUserByMail(userDto.mail)
        if (!user){
            throw new UnauthorizedException({message:'Invalid credentials'})
        }

        const passwordEquals = await bcrypt.compare(userDto.password, user.password)
        if(!passwordEquals){
            throw new UnauthorizedException({message:'Invalid credentials'})
        }
        if(!user.isVerified){
            throw new UnauthorizedException({message:'please verify'});
        }
        return user
    }
     async validateAccount( mail:string, accessCode:string) {
        const user = await this.userService.getUserByMail(mail)
        if (!user) throw new HttpException('user does not exist', HttpStatus.UNAUTHORIZED);

        const codeEquals = await bcrypt.compare(accessCode, user.accesscode)
         return {user, codeEquals}
    }

    private async sendMail( mail : string): Promise<void> {
        const user = await this.userService.getUserByMail(mail)
        if (!user) throw new HttpException('userrr does not exist', HttpStatus.UNAUTHORIZED);

        const recoveryCode = Math.floor(100000 + Math.random() * 900000);

        await SendGrid.send({
            to: mail,
            subject: 'Reset password',
            from: process.env.SEND_GRID_EMAIL,
            html: content(recoveryCode)
        })
        const updateUser = await this.userService.updateUser({...user, accesscode:bcrypt.hash(recoveryCode.toString(),5).toString(), mail});
    }
    async modifyUser( data:Partial<ModifyUserDto> & {mail:string}) {
        const user = await this.userService.getUserByMail(data.mail)
        if(data.password && data.newPassword){
            const isValid = await bcrypt.compare(user.password,data.password)
            if(!isValid){
                throw new HttpException('invalid password', HttpStatus.BAD_REQUEST);
            }
            user.password = data.newPassword
            delete data.newPassword
            delete data.password
        }

        await this.userService.updateUser({...user, ...data})
    }

}