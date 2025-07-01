import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { firstValueFrom, Observable } from 'rxjs';
@Injectable()
export class JwtGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private reflector: Reflector) {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // If endpoint is marked as public the guard lets the request go through
    const isPublic = this.reflector.getAllAndOverride('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const allowOptionalAuth = this.reflector.getAllAndOverride('allowOptionalAuth', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (allowOptionalAuth) {
      try {
        // awaiting the result of passport AuthGuard logic to catch any error
        return await super.canActivate(context) as boolean;
      } catch (error) {
        // if any error is catched the request still goes through as the endpoint is marked
        // with optional auth decorator
        return true;
      }
    }

    /**
     * Default behaviour: requiring authentication
     */
    return await super.canActivate(context) as boolean;
  }
}