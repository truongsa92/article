import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '1',
  database: 'demo',
  entities: [ './src/**/*.entity.ts' ],
  synchronize: true,
  keepConnectionAlive: true
};
