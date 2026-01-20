
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { ENVEnum } from 'src/common/enum/env.enum';
import { UserEnum } from 'src/common/enum/user.enum';
import { User } from 'src/entities/user.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class SuperAdminService implements OnModuleInit {
  private readonly logger = new Logger(SuperAdminService.name);

  constructor(
    
    private readonly configService: ConfigService,
     private readonly dataSource: DataSource,
  ) {}

  onModuleInit(): Promise<void> {
    return this.seedSuperAdminUser();
  }

  async seedSuperAdminUser() {
   const superAdminEmail=this.configService.getOrThrow<string>(
    ENVEnum.SUPER_ADMIN_EMAIL,
   )
   const superAdminPassword=this.configService.getOrThrow<string>(
    ENVEnum.SUPER_ADMIN_PASS,
   )
   
   const userRepository = this.dataSource.getRepository(User);

    const superAdminExists = await userRepository.findOne({
      where: { email: superAdminEmail },
   });

    if (superAdminExists) {
      this.logger.log('Super Admin user already exists. Skipping seeding.');
      return;
    }

   const superAdmin = userRepository.create({
        email: superAdminEmail,
        password: await bcrypt.hash(superAdminPassword, 10),
        roles: [UserEnum.SUPER_ADMIN],
        isActive: true,
        isDeleted: false,
        firstName: 'Super',
        lastName: 'Admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
       await userRepository.save(superAdmin);
   this.logger.log('Super Admin user seeded successfully.');
  }
  

  
}