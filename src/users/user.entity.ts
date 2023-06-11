import { hash } from "bcrypt";
import { Rol } from "src/roles/rol.entity";
import { BeforeInsert, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'users'})
export class User{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: String;

    @Column()
    lastname: String;

    @Column({unique: true})
    idNumber: String;

    @Column()
    email:String;

    @Column()
    phone: String;

    @Column()
    division: String;

    @Column({unique: true})
    userName: String;

    @Column()
    password: String;

    @Column({nullable: true})
    image: String;

    @Column({type: 'datetime', default: () => 'CURRENT_TIMESTAMP'})
    created_at: Date;

    @Column({type: 'datetime', default: () => 'CURRENT_TIMESTAMP'})
    updated_at: Date;

    @Column({nullable: true})
    notification_token: String;

    @JoinTable({
        name: 'user_has_roles',
        joinColumn: {
            name: 'id_user'
        },
        inverseJoinColumn: {
            name: 'id_rol'
        }
    })
    @ManyToMany(() => Rol, (rol) => rol.users)
    roles: Rol[];


    @BeforeInsert()
    async hashPassword(){
        this.password = await hash(this.password, Number(process.env.HASH_SALT));
    }

    
}