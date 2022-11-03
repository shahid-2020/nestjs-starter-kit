import { ApiProperty, PickType, PartialType } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignupDto {
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

  @ApiProperty({ description: 'Password' })
  @MinLength(8, { message: 'Password must contain minimum of 8 characters' })
  @MaxLength(32, { message: 'Password must contain maximum of 32 characters' })
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Weak Password',
  })
  @IsNotEmpty()
  password: string;
}

export class SigninDto extends PartialType(
  PickType(SignupDto, ['email'] as const),
) {
  @ApiProperty({ description: 'Password' })
  @MinLength(8, { message: 'Invalid Password' })
  @MaxLength(32, { message: 'Invalid Password' })
  @IsNotEmpty()
  password: string;
}

export class ForgotPasswordDto extends PartialType(
  PickType(SignupDto, ['email'] as const),
) {}

export class ResetPasswordDto extends PartialType(
  PickType(SignupDto, ['password'] as const),
) {
  @ApiProperty({ description: 'Reset Token' })
  @IsString()
  @IsNotEmpty()
  token: string;
}
