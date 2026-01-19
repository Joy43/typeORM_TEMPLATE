import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsOptional,
  IsArray,
  IsEnum,
} from 'class-validator';



export class RegisterDto {
 @ApiProperty({
    example: 'qVH2w@example.com',
    description: 'User email',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'strongPassword123',
    description: 'User password (minimum 6 characters)',
  })
    @IsNotEmpty()
  @MinLength(6)
  password: string;



}

export class LoginDto {
  @ApiProperty({
    example: 'qVH2w@example.com',
    description: 'User email',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'strongPassword123',
    description: 'User password',
  })
  @IsNotEmpty()
  password: string;
}
