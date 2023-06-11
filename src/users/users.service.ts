import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import storage = require('../utils/cloud_storage');

@Injectable()
export class UsersService {

    constructor(@InjectRepository(User) private userRepository: Repository<User>){

    }

    create(user: CreateUserDTO){
        const newUser = this.userRepository.create(user)
        return this.userRepository.save(newUser)
    }

    findAll(){
        return this.userRepository.find({ relations: ['roles']})
    }

    async update(id: number, user: UpdateUserDTO){
        const userFound = await this.userRepository.findOneBy({id:id});
        if (!userFound) {
            throw new HttpException('Usuario no existe', HttpStatus.NOT_FOUND);
        }

        const userUpdated = Object.assign(userFound, user);
        return this.userRepository.save(userUpdated);
    }

    async updateWithImage(file: Express.Multer.File, id: number, user: UpdateUserDTO ){
        const url = await storage(file, file.originalname);
        console.log(file);
        if (url === undefined && url === null) {
            throw new HttpException('La imagen no se pudo guardar.', HttpStatus.INTERNAL_SERVER_ERROR);
        }

        const userFound = await this.userRepository.findOneBy({id:id});
        if (!userFound) {
            throw new HttpException('Usuario no existe', HttpStatus.NOT_FOUND);
        }

        user.image = url;
        const userUpdated = Object.assign(userFound, user);
        return this.userRepository.save(userUpdated);
               
    }

    
}
