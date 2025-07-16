import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User, UserRole } from '@prisma/client';
import { Observable } from 'rxjs';
import { LocalAuthRequest } from 'src/identity/auth/dto/auth.dto';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRole: string = this.reflector.get<UserRole>('role', context.getHandler());
    if (!requiredRole) return true;

    const request: LocalAuthRequest = context.switchToHttp().getRequest();
    const user: User = request.user;

    return user.role === requiredRole;
  }
}
