import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [path.join(__dirname, '..', '**', '**', '*.entity{.ts,.js}')],
  migrations: [path.join(__dirname, 'migrations', '*{.ts,.js}')],
  migrationsRun: process.env.NODE_ENV === 'development',
  synchronize: process.env.NODE_ENV !== 'development',
  logging: true,
  logger: 'file',
};

export const DATASOURCE = 'DATASOURCE';

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
