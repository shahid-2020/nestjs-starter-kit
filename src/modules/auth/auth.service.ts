import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { UtilService } from '../util/util.service';
import {
  ForgotPasswordDto,
  ResetPasswordDto,
  SigninDto,
  SignupDto,
} from './dtos/auth.dto';
import HttpResponse from '../../shared/http/response/response.http';
import CreatedResponse from '../../shared/http/response/created.http';
import OkResponse from '../../shared/http/response/ok.http';
import { Providers } from '../user/enums/user.enum';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private utilService: UtilService,
    private mailService: MailService,
    private configService: ConfigService,
  ) {}

  async validate(signinDto: SigninDto): Promise<User> {
    try {
      const { email, password } = signinDto;
      const user = await this.userService.findOne({
        where: { email },
        select: ['id', 'firstName', 'lastName', 'email', 'password', 'roles'],
      });
      return this.utilService.argon2verify(user.password, password)
        ? user
        : null;
    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async signup(signupDto: SignupDto): Promise<HttpResponse> {
    try {
      const { user } = (await this.userService.create(signupDto)).data;
      const { id, email } = user;
      const access_token = await this.utilService.signJWT({ id, email });
      return new CreatedResponse({ user, access_token });
    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async signin(user: any): Promise<HttpResponse> {
    try {
      const { id } = user;
      const access_token = await this.utilService.signJWT({ id });
      return new OkResponse({ user, access_token });
    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async googleCallback(user: any): Promise<HttpResponse> {
    try {
      if (!user) {
        throw new BadRequestException();
      }
      const { firstName, lastName, email } = user;
      const existingUser = await this.userService.findOne({ where: { email } });

      if (existingUser) return this.signin(existingUser);

      return this.userService.create({
        firstName,
        lastName,
        email,
        provider: Providers.GOOGLE,
      });
    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async forgotPassword({ email }: ForgotPasswordDto): Promise<HttpResponse> {
    try {
      const user = await this.userService.findOne({ where: { email } });
      if (!user) {
        throw new NotFoundException();
      }
      const frontendBaseUrl = this.configService.get('FR_BASE_URL');
      const resetToken = await this.utilService.signJWT(
        { id: user.id },
        { expiresIn: 600000 },
      );
      const resetURL = `${frontendBaseUrl}/auth/reset-password/${resetToken}`;
      if (
        !(await this.mailService.sendResetPasswordMail(user, resetURL)).sent
      ) {
        throw new InternalServerErrorException('Email sent failed');
      }
      return new OkResponse();
    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<HttpResponse> {
    try {
      const { token, password } = resetPasswordDto;
      const payload = this.utilService.decodeJWT(token);
      if (!payload || !payload['id']) {
        throw new BadRequestException();
      }
      const user = await this.userService.findOne({
        where: { id: payload['id'] },
      });
      if (!user) {
        throw new BadRequestException();
      }
      await this.userService.update(user.id, { password });
      return new OkResponse();
    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async signout(): Promise<HttpResponse> {
    try {
      return new OkResponse({ user: null, access_token: null });
    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }
}
