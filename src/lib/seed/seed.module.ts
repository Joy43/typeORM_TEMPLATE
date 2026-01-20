import { Global, Module } from '@nestjs/common';
import { SuperAdminService } from './super-admin.seed.service';
import { DefaultUsersService } from './default.user.service';


@Global()
@Module({
  imports: [],
  providers: [SuperAdminService,  DefaultUsersService],
})
export class SeedModule {}