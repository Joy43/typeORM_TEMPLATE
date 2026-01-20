// import { SeedModule } from './seed/seed.module';
import { Module } from '@nestjs/common';
import { SeedModule } from './seed/seed.module';
import { MailModule } from './mail/mail.module';

@Module({
    imports: [SeedModule, MailModule],
    exports: [SeedModule, MailModule],
})
export class LibModule {}