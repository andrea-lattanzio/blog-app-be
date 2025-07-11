import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { GetUser } from 'src/shared/decorators/getUser.decorator';
import { Public } from 'src/shared/decorators/public.decorator';
import { LocalAuthGuard } from 'src/shared/guards/local.guard';

import { User } from '../../user/user.interface';
import { UserService } from '../../user/user.service';

import {
  LoginResponseDto,
  RegisterRequestDto,
  UserInfoDto,
} from '../dto/auth.dto';
import { AuthService } from '../services/auth.service';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authSrv: AuthService,
    private readonly userSrv: UserService,
  ) { }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({
    summary: 'Login',
    description:
      'This endpoint receives an email and a password and after validating them, returns a jwt token with the encrypted user infos',
  })
  async login(@Request() req): Promise<LoginResponseDto> {
    return this.authSrv.login(req.user);
  }

  @Public()
  @Post('register')
  @ApiOperation({
    summary: 'Register',
    description:
      'This endpoint receives an email and a password and creates a new user if email is not already present',
  })
  async register(
    @Body() registerRequestDto: RegisterRequestDto,
  ): Promise<LoginResponseDto> {
    return this.authSrv.register(registerRequestDto);
  }

  @Get()
  @ApiOperation({
    summary: 'profile',
    description: 'This endpoint returns the currently logged in user info',
  })
  async profile(@GetUser() user: User): Promise<UserInfoDto> {
    const currentUser = await this.authSrv.profile(user);

    return new UserInfoDto(currentUser);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete',
    description: 'This endpoint deletes a user',
  })
  async deleteUser(@Param('id') id: string): Promise<UserInfoDto> {
    return this.userSrv.remove(id);
  }
}
