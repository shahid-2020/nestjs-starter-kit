import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import dataSource, { DATASOURCE, dataSourceOptions } from './data-source';

@Global()
@Module({
  imports: [TypeOrmModule.forRoot(dataSourceOptions)],
  providers: [{ provide: DATASOURCE, useValue: dataSource }],
  exports: [DATASOURCE],
})
export class DatabaseModule {}
