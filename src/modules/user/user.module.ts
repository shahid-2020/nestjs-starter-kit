import { Module } from '@nestjs/common';

import { UtilModule } from '../util/util.module';
import { UserRepository } from './repositories/user.repository';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CustomTypeOrmModule } from '../custom-typeorm/custom-typeorm.module';

@Module({
  imports: [CustomTypeOrmModule.forFeature([UserRepository]), UtilModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
