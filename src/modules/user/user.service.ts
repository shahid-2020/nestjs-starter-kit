import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { FindOneOptions } from 'typeorm';

import { User } from './entities/user.entity';
import OkResponse from '../../shared/http/response/ok.http';
import HttpResponse from '../../shared/http/response/response.http';
import { CreateUserDto, UpdateUserDto } from './dtos/user.dto';
import { UtilService } from '../util/util.service';
import CreatedResponse from '../../shared/http/response/created.http';
import { UserRepository } from './repositories/user.repository';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private utilService: UtilService,
  ) {}

  async findOne(findOptions: FindOneOptions): Promise<User> {
    try {
      const user = await this.userRepository.findOne(findOptions);
      return user;
    } catch (error: any) {
      throw error;
    }
  }

  async me(user: User): Promise<HttpResponse> {
    try {
      return new OkResponse({ user });
    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async create(createUserDto: CreateUserDto): Promise<HttpResponse> {
    try {
      if (createUserDto.password) {
        const { password } = createUserDto;
        createUserDto.password = await this.utilService.argon2hash(password);
      }
      const user = this.userRepository.createUser(createUserDto);
      return new CreatedResponse({ user });
    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<HttpResponse> {
    try {
      if (updateUserDto.password) {
        const { password } = updateUserDto;
        const hashedPassword = await this.utilService.argon2hash(password);
        updateUserDto.password = hashedPassword;
      }
      const user = await this.userRepository.updateUser(id, updateUserDto);
      if (user) {
        throw new BadRequestException();
      }
      return new OkResponse({ user });
    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async delete(id: string): Promise<HttpResponse> {
    try {
      const user = await this.userRepository.deleteUser(id);
      if (user) {
        throw new BadRequestException();
      }
      return new OkResponse({ user });
    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }
}
