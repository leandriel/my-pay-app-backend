import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtRol } from "./jwt-rol";

@Injectable()
export class JwtRolesGuard implements CanActivate{
    constructor(private reflector: Reflector){}

    canActivate(context: ExecutionContext): boolean{
        const requiredRoles = this.reflector.getAllAndOverride<JwtRol[]>('roles',[
            context.getHandler(),
            context.getClass()
        ]);
        if (!requiredRoles) {
            return true;            
        }
        const {user} = context.switchToHttp().getRequest();
        return requiredRoles.some((rol) => user?.roles?.includes(rol));
    }

}