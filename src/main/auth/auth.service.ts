import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../../entities/user.entity';
import { UserEnum } from '../../common/enum/user.enum';
import { RegisterDto } from './dto/auth.dto';
import { UpdateUserDto } from './dto/update.user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user = this.userRepository.create({
      email: registerDto.email,
      password: hashedPassword,
      isActive: true,
      isDeleted: false,
    });

    await this.userRepository.save(user);

    const { password: _, ...result } = user;
    return result;
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user || user.isDeleted) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('User is not active');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        roles: user.roles,
      },
    };
  }

  async validateUser(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async refreshToken(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async updateUser(userId: string, updateData: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user || user.isDeleted) {
      throw new UnauthorizedException('User not found');
    }
    const updateUser = await this.userRepository.merge(user, updateData);
    return this.userRepository.save(updateUser);
  }
}
