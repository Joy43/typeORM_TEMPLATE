import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    example: 'John',
    description: 'User first name',
  })
  @IsOptional()
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: 'User last name',
  })
  @IsOptional()
  lastName: string;
  @ApiProperty({
    example: 'https://example.com/photo.jpg',
    description: 'User photo URL',
  })
  @IsOptional()
  photo: string;
}
