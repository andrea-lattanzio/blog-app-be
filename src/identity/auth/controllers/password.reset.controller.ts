import { Body, Controller, Post } from "@nestjs/common";
import { MailSenderService } from "src/mailer/mailer.service";
import { AuthService } from "../services/auth.service";
import { ApiTags } from "@nestjs/swagger";
import { Public } from "src/shared/decorators/public.decorator";
import { PasswordResetService } from "../services/password.reset.service";
import { RequestResetPasswordDto, ResetPasswordDto } from "../dto/passowrd.reset.dto";
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
  async resetPassword(@Body() { email, token, newPassword }: ResetPasswordDto): Promise<void> {
    await this.passwordResetSrv.validateAndConsumeToken(email, token);
    await this.authSrv.changePassword(email, newPassword);
  }
}
