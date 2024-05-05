import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { join } from 'path';

@Module({
    imports: [
        MailerModule.forRootAsync({
            useFactory: () => ({
                transport: {
                    port: 587,
                    host: 'smtp.gmail.com',
                    from: 'viralrupani12017@gmail.com',
                    auth: {
                        user: 'viralrupani12017@gmail.com',
                        pass: 'fhth ghsa egbs egoj',
                    },
                },
                template: {
                    dir: join(__dirname, 'templates/'),
                    adapter: new EjsAdapter(),
                },
            }),
        }),
    ],
    providers: [EmailService],
    exports: [EmailService],
})
export class EmailModule {}
