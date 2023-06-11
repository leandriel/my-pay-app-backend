import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRolDTO } from './dto/create-rol.dto';
import { HasRoles } from 'src/auth/jwt/has-roles';
import { JwtRol } from 'src/auth/jwt/jwt-rol';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { JwtRolesGuard } from 'src/auth/jwt/jwt_roles.guard';

@Controller('roles')
export class RolesController {

    constructor( private rolesService: RolesService){}

    @HasRoles(JwtRol.ADMIN)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Post()
    create(@Body() rol: CreateRolDTO){
        return this.rolesService.create(rol);
    }

}
