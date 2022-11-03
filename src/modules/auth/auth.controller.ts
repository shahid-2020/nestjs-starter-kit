import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import HttpResponse from '../../shared/http/response/response.http';
import {
  ForgotPasswordDto,
  ResetPasswordDto,
  SigninDto,
  SignupDto,
} from './dtos/auth.dto';
import { GetUser } from './decorators/get-user.decorator';
import { User } from '../user/entities/user.entity';
import { GoogleAuthGuard } from './guards/google-auth.guard';

@ApiTags('Auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Sign up user' })
  @Post('signup')
  async signup(@Body() signupDto: SignupDto): Promise<HttpResponse> {
    return this.authService.signup(signupDto);
  }

  @ApiOperation({ summary: 'Sign in user' })
  @ApiBody({ required: true, type: SigninDto })
  @UseGuards(LocalAuthGuard)
  @Post('signin')
  @HttpCode(200)
  async signin(@GetUser() user: User): Promise<HttpResponse> {
    return this.authService.signin(user);
  }

  @ApiOperation({ summary: 'Redirects to Google OAuth pop up' })
  @UseGuards(GoogleAuthGuard)
  @Get('google')
  async signinGoogle(): Promise<void> {
    // No Defination
  }

  @ApiOperation({ summary: 'The endpoint called from google after signin' })
  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleCallback(@GetUser() user: User): Promise<HttpResponse> {
    return this.authService.googleCallback(user);
  }

  @ApiOperation({ summary: 'Forgot password' })
  @Post('forgot-password')
  @HttpCode(200)
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<HttpResponse> {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @ApiOperation({ summary: 'Reset password' })
  @Post('reset-password')
  @HttpCode(200)
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<HttpResponse> {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @ApiOperation({ summary: 'Sign out user' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete('signout')
  async signout(): Promise<HttpResponse> {
    return this.authService.signout();
  }
}
