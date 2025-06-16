import { Controller } from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { MailSenderService } from 'src/mailer/mailer.service';
import { AuthService } from '../services/auth.service';

@Controller('reset-password')
export class PasswordResetController {
  constructor(
    private readonly userSrv: UserService,
    private readonly authSrv: AuthService,
    private readonly mailerSrv: MailSenderService
  ) {}

  
  
}
