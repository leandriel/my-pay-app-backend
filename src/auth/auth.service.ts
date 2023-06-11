import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { User } from 'src/users/user.entity';
import { Repository, Equal, In } from 'typeorm';
import { RegisterAuthDTO } from './dto/register-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginAuthDTO } from './dto/login-auth.dto';
import {compare} from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { Rol } from 'src/roles/rol.entity';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(User) private usersRespository: Repository<User>,
        @InjectRepository(Rol) private rolesRepository: Repository<Rol>,
        private jwtService: JwtService
        ){}

    async register(user: RegisterAuthDTO){

        const {idNumber, userName} = user;

        const dniExist = await this.usersRespository.findOneBy({idNumber: Equal(idNumber)})

        if (dniExist){
            //409 Conflict
            throw new HttpException('El DNI ingresado ya existe', HttpStatus.CONFLICT)
        }

        const userNameExist = await this.usersRespository.findOneBy({userName: Equal(userName)})

        if (userNameExist){
            //409 Conflict
            throw new HttpException('El nombre de usuario ya existe', HttpStatus.CONFLICT)
        }

        const newUser = this.usersRespository.create(user);
        let rolesIds = []
        if (user.rolesIds !== undefined && user.rolesIds !== null){
            rolesIds = user.rolesIds;
        }
        else{
            rolesIds.push('CLIENT')
        }

        
        const roles = await this.rolesRepository.findBy({id: In(rolesIds)});
        newUser.roles = roles;

        const userSaved = await this.usersRespository.save(newUser);
        const rolesString = userSaved.roles.map(rol => rol.id)

        const payload = {
            id: userSaved.id,
            userName: userSaved.userName,
            roles: rolesString
            };
        const token = this.jwtService.sign(payload);
        const data = {
            user: userSaved,
            token:'Bearer ' + token
        }
        delete data.user.password;

        return data;
    }

    async login(loginData: LoginAuthDTO){

        const {userName, password} = loginData;
        const userFound = await this.usersRespository.findOne({
            where: {userName: Equal(userName)},
            relations: ['roles']
        })

        if (!userFound){
            //404 Not found
            throw new HttpException('El usuario ingresado no existe', HttpStatus.NOT_FOUND);
        }

        const isPasswordValid = await compare(password, userFound.password);

        if (!isPasswordValid){
            //403 FIRBITTEN access denied
            throw new HttpException('La contraseña es incorrecta', HttpStatus.FORBIDDEN);
        }

        const rolesIds = userFound.roles.map(rol => rol.id); //['CLIENT', 'ADMIN']
        const payload = {
            id: userFound.id,
            userName: userFound.userName,
            roles: rolesIds
            };
        const token = this.jwtService.sign(payload);
        const data = {
            user: userFound,
            token:'Bearer ' + token
        }

        delete data.user.password;

        return data;

    }


}
