import {
  ApiProperty,
  PickType,
  PartialType,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

import { Providers } from '../enums/user.enum';

export class CreateUserDto {
  @ApiProperty({ description: 'First Name' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ description: 'Last Name' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ description: 'Email' })
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiPropertyOptional({ description: 'Password' })
  @MinLength(8, { message: 'Password must contain minimum of 8 characters' })
  @MaxLength(32, { message: 'Password must contain maximum of 32 characters' })
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Weak Password',
  })
  @IsString()
  @IsOptional()
  password?: string;

  @ApiPropertyOptional({ enum: Providers, description: 'Auth provider' })
  @IsEnum(Providers)
  @IsOptional()
  provider?: Providers;
}

export class UpdateUserDto extends PartialType(
  PickType(CreateUserDto, ['firstName', 'lastName', 'password'] as const),
) {}
