import { IsNotEmpty, IsString } from "class-validator";

export class LoginAuthDTO{

    @IsNotEmpty()
    @IsString()
    userName: String;
    
    @IsNotEmpty()
    @IsString()
    password: String;
}