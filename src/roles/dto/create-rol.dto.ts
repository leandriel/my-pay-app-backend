import { IsNotEmpty, IsString } from "class-validator";

export class CreateRolDTO{

    @IsNotEmpty()
    @IsString()
    id: String;
    
    @IsNotEmpty()
    @IsString()
    name: String;

    @IsNotEmpty()
    @IsString()
    image: String;

    @IsNotEmpty()
    @IsString()
    route: String;

}