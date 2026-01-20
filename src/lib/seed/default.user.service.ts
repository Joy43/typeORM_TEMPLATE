import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { DataSource } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { UserEnum } from 'src/common/enum/user.enum';
import { ENVEnum } from 'src/common/enum/env.enum';

@Injectable()
export class DefaultUsersService implements OnModuleInit {
  private readonly logger = new Logger(DefaultUsersService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly dataSource: DataSource,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.seedDefaultUsers();
  }

  async seedDefaultUsers() {
    const userRepository = this.dataSource.getRepository(User);

    // Define default users (excluding super admin as it's handled by SuperAdminService)
    const defaultUsers = [
      {
        firstName: 'Alice',
        lastName: 'Manager',
        email: 'alice.manager@example.com',
        password: '12345678',
        roles: [UserEnum.USER],
      },
      {
        firstName: 'Bob',
        lastName: 'Editor',
        email: 'bob.editor@example.com',
        password: '12345678',
        roles: [UserEnum.CONTRIBUTOR],
      },
      {
        firstName: 'Charlie',
        lastName: 'User',
        email: 'charlie.user@example.com',
        password: '12345678',
        roles: [UserEnum.MEMBER],
      },
      {
        firstName: 'Diana',
        lastName: 'User',
        email: 'user2@gmail.com',
        password: '12345678',
        roles: [UserEnum.USER],
      },
      {
        firstName: 'Eve',
        lastName: 'Member',
        email: 'member@gmail.com',
        password: '12345678',
        roles: [UserEnum.MEMBER],
      },
      {
        firstName: 'Frank',
        lastName: 'User',
        email: 'frank.user@example.com',
        password: '12345678',
        roles: [UserEnum.USER],
      },
      {
        firstName: 'Grace',
        lastName: 'Admin',
        email: 'admin@gmail.com',
        password: '12345678',
        roles: [UserEnum.ADMIN],
      },
    ];

    for (const userData of defaultUsers) {
      const exists = await userRepository.findOne({
        where: { email: userData.email },
      });
      if (exists) {
        this.logger.log(`[SKIP] User already exists: ${userData.email}`);
        continue;
      }

      const hashedPassword = await bcrypt.hash(userData.password, 10);

      const user = userRepository.create({
        ...userData,
        password: hashedPassword,
        isDeleted: false,
        photo: `https://ui-avatars.com/api/?name=${encodeURIComponent(
          userData.firstName + ' ' + userData.lastName,
        )}&background=7A1CAC&color=fff&size=256`,
      });

      await userRepository.save(user);
      this.logger.log(`[CREATE] Default user created: ${userData.email}`);
    }
  }
}
