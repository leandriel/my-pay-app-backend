import { Body, Controller, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, ParseIntPipe, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { UpdateUserDTO } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtRolesGuard } from 'src/auth/jwt/jwt_roles.guard';
import { HasRoles } from 'src/auth/jwt/has-roles';
import { JwtRol } from 'src/auth/jwt/jwt-rol';

@Controller('users')
export class UsersController {

    constructor(private userService: UsersService){}

    @HasRoles(JwtRol.ADMIN)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Get()// http://localhost:3000/users -> Get
    findAll(){
        return this.userService.findAll();
    }

    @Post()// http://localhost:3000/users -> Post
    create(@Body() user: CreateUserDTO){
        return this.userService.create(user)
    }

    @HasRoles(JwtRol.ADMIN)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Put(':id')// http://localhost:3000/users/:id -> Put
    update(@Param('id', ParseIntPipe)id: number, @Body() user: UpdateUserDTO){
        return this.userService.update(id,user);
    }

    @HasRoles(JwtRol.ADMIN)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Post('upload/:id')
    @UseInterceptors(FileInterceptor('file'))
    updateWithImage(@UploadedFile(
        new ParseFilePipe({
            validators: [
              new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 10 }),
              new FileTypeValidator({ fileType: '.(png|jpeg|jpg)'}),
            ],
          }),
    ) file: Express.Multer.File,
    @Param('id', ParseIntPipe)id: number,
    @Body() user: UpdateUserDTO
    ) {
        return this.userService.updateWithImage(file, id, user);  
}
    
}
