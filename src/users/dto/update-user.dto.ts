import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateUserDTO{

    @IsNotEmpty()
    @IsString()
    @IsOptional()
    name?: String;

    
    @IsNotEmpty()
    @IsString()
    @IsOptional()
    lastname?: String;

    @IsNotEmpty()
    @IsString()
    @IsOptional()
    idNumber?: String;

    @IsNotEmpty()
    @IsString()
    @IsOptional()
    email?: String;

    @IsNotEmpty()
    @IsString()
    @IsOptional()
    phone?: String;

    @IsNotEmpty()
    @IsString()
    @IsOptional()
    division?: String;

    @IsNotEmpty()
    @IsString()
    @IsOptional()
    password?: String;

    @IsNotEmpty()
    @IsString()
    @IsOptional()
    image?: String;

    @IsNotEmpty()
    @IsString()
    @IsOptional()
    notification_token?: String;
    
}