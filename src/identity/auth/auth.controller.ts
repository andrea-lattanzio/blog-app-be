import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginResponseDto, RegisterRequestDto } from './dto/auth.dto';
import { User } from '../user/user.interface';
import { Public } from 'src/shared/decorators/public.decorator';
import { GetUser } from 'src/shared/decorators/getUser.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authSrv: AuthService) {}

  @Public()
  @Post('login')
  login(@Request() req): Promise<LoginResponseDto> {
    return this.authSrv.login(req.user);
  }

  @Public()
  @Post('register')
  register(
    @Body() registerRequestDto: RegisterRequestDto,
  ): Promise<LoginResponseDto> {
    return this.authSrv.register(registerRequestDto);
  }

  @Get()
  async profile(@GetUser() user: User) {
    return this.authSrv.profile(user);
  }
}
