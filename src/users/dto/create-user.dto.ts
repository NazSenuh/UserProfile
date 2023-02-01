import { IsEmail, IsString, Length } from "class-validator";
import {User} from "../user.model";

export  class CreateUserDto{
    @IsString({message:'Only String'})
    @IsEmail({},{message:'Uncorrected email'})
    readonly mail:string

    @IsString({message:'Only String'})
    @Length(4,16,{message:'Longer than 4 symbols'})
    readonly password:string
}


export  class ModifyUserDto extends User{
    @IsString({message:'Only String'})
    newPassword: string
}

