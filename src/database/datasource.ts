import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';

config({
    path: __dirname + '/../../.env',
});
const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: Boolean(process.env.DB_SYNC),
    entities: ['dist/*/entities/*.entity.js'],
    migrations: ['dist/database/migrations/*js'],
    logging: Boolean(process.env.DB_LOGGING),
};

export default new DataSource(dataSourceOptions);
