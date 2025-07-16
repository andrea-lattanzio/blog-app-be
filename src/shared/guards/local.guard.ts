import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { plainToClass } from 'class-transformer';
import { ValidationError, validate } from 'class-validator';
import { Request, Response } from 'express';
import { LoginRequestDTO } from 'src/identity/auth/dto/auth.dto';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') implements CanActivate {
  constructor() {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest<Request>();
    const response: Response = context.switchToHttp().getResponse<Response>();
    const body: LoginRequestDTO = plainToClass(LoginRequestDTO, request.body);
    const errors: ValidationError[] = await validate(body);
    /* eslint-disable @typescript-eslint/typedef */
    const errorMessages: string[] = errors.flatMap(({ constraints }) =>
      Object.values(constraints ?? {}),
    );
    /* eslint-enable @typescript-eslint/typedef */
    if (errorMessages.length > 0) {
      response.status(HttpStatus.BAD_REQUEST).send({
        statusCode: HttpStatus.BAD_REQUEST,
        error: 'Bad Request',
        message: errorMessages,
      });
    }

    return super.canActivate(context) as Promise<boolean>;
  }
}
