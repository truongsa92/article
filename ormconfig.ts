import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'db',
  port: 3306,
  username: 'root',
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [ './src/**/*.entity.ts' ],
  synchronize: true,
  keepConnectionAlive: true
};
