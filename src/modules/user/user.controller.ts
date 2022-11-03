import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import HttpResponse from '../../shared/http/response/response.http';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateUserDto } from './dtos/user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@ApiTags('User')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'user', version: '1' })
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOperation({ summary: 'Get current logged in user' })
  @Get('me')
  async getUser(@GetUser() user: User): Promise<HttpResponse> {
    return this.userService.me(user);
  }

  @ApiOperation({ summary: 'Update current logged in user' })
  @Patch('update/me')
  async update(
    @Body() updateUserDto: UpdateUserDto,
    @GetUser() user: User,
  ): Promise<HttpResponse> {
    return this.userService.update(user.id, updateUserDto);
  }

  @ApiOperation({ summary: 'Delete current logged in user' })
  @Delete('delete/me')
  async delete(@GetUser() user: User): Promise<HttpResponse> {
    return this.userService.delete(user.id);
  }
}
