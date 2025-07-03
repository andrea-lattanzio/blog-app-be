import { Body, Controller, Post } from "@nestjs/common";
import { MailSenderService } from "src/mailer/mailer.service";
import { AuthService } from "../services/auth.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { Public } from "src/shared/decorators/public.decorator";
import { PasswordResetService } from "../services/password.reset.service";
import { RequestResetPasswordDto, ResetPasswordDto } from "../dto/password.reset.dto";
import { MailOptions } from "src/mailer/mail.utils";

export interface ResetPasswordMailContext {
  passwordResetLink: string;
}

@ApiTags("Password Reset")
@Public()
@Controller("reset-password")
export class PasswordResetController {
  constructor(
    private readonly passwordResetSrv: PasswordResetService,
    private readonly authSrv: AuthService,
    private readonly mailerSrv: MailSenderService,
  ) { }

  @Post("request")
  @ApiOperation({
    summary: 'Request Password Change',
    description:
      'This endpoint sends an email that allows to reset the password',
  })
  async requestReset(@Body() { email }: RequestResetPasswordDto): Promise<void> {
    const token: string = await this.passwordResetSrv.createResetToken(email);
    const resetPasswordEmailOptions: MailOptions<ResetPasswordMailContext> = {
      subject: "Reset your password.",
      template: "reset-password",
      context: { passwordResetLink: this.passwordResetSrv.generateResetPasswordLink(token) },
    };
    await this.mailerSrv.send([email], resetPasswordEmailOptions);
  }

  @Post("reset")
  @ApiOperation({
    summary: 'Reset Password',
    description:
      'This endpoint resets the password',
  })
  async resetPassword(@Body() { email, token, newPassword }: ResetPasswordDto): Promise<void> {
    await this.passwordResetSrv.validateAndConsumeToken(email, token);
    await this.authSrv.changePassword(email, newPassword);
  }
}
