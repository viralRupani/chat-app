import { TransportType } from '@nestjs-modules/mailer/dist/interfaces/mailer-options.interface';
import { DataSourceOptions } from 'typeorm';

export default () => ({
    port: parseInt(process.env.PORT, 10) || 3000,
    database: {
        type: process.env.DB_TYPE,
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT, 10) || 5432,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        synchronize: Boolean(process.env.DB_SYNC),
        logging: Boolean(process.env.DB_LOGGING),
        entities: ['dist/*/entities/*.entity.js'],
        migrations: ['dist/database/migrations/*js'],
    } as DataSourceOptions,
    mail: {
        host: process.env.MAIL_HOST,
        port: +process.env.MAIL_PORT,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
        from: process.env.MAIL_USER,
    } as TransportType,
    bcrypt: {
        hash: +process.env.B_HASH,
    },
});
