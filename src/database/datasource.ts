import { DataSource, DataSourceOptions } from 'typeorm';

const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'viralrupani',
    password: 'viral@12017',
    database: 'chat-app',
    synchronize: false,
    entities: ['dist/*/entities/*.entity.js'],
    migrations: ['dist/database/migrations/*js'],
    logging: true,
};

export default new DataSource(dataSourceOptions);
export { dataSourceOptions };
