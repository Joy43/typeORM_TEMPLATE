import { Global, Module } from '@nestjs/common';
import { MailService } from './service/mail.service';
import { AuthMailService } from './service/auth.mail.service';

@Global()
@Module({
  providers: [MailService, AuthMailService],
  exports: [AuthMailService],
})
export class MailModule {}
