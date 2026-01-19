import { Controller, Post, Body, UseGuards, Get, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../../common/jwt/jwt.gurd';
import { GetUser, ValidateAuth } from '../../common/jwt/jwt.decorator';
import { UserEnum } from '../../common/enum/user.enum';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update.user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(
      registerDto
    );
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@GetUser() user: any) {
    return user;
  }

  @Get('admin')
  @ValidateAuth(UserEnum.ADMIN, UserEnum.SUPER_ADMIN)
  getAdminData(@GetUser() user: any) {
    return { message: 'Admin data', user };
  }

  @Patch('refresh-token')
  @UseGuards(JwtAuthGuard)
  async refreshToken(@GetUser() user: any) {
    return this.authService.refreshToken(user);
  }

  // --------update user------
  @Patch('update')
  @ApiBearerAuth()
  @ValidateAuth()
  updateUserData(@GetUser('userId') userId: string, @Body() dto: UpdateUserDto) {
    return this.authService.updateUser(userId, dto);
  }
}
