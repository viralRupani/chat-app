import { Controller, Get } from '@nestjs/common';
import {
    HealthCheckService,
    HttpHealthIndicator,
    HealthCheck,
    TypeOrmHealthIndicator,
    DiskHealthIndicator,
} from '@nestjs/terminus';
import { SkipAuth } from 'src/common/decorators/skip-auth.decorator';

@Controller('health')
export class HealthController {
    constructor(
        private health: HealthCheckService,
        private http: HttpHealthIndicator,
        private db: TypeOrmHealthIndicator,
        private readonly disk: DiskHealthIndicator,
    ) {}

    @SkipAuth()
    @Get()
    @HealthCheck()
    check() {
        return this.health.check([
            () => this.http.pingCheck('Server', 'http://localhost:3000'),
            () => this.db.pingCheck('Database'),
            () =>
                this.disk.checkStorage('storage', {
                    path: '/',
                    thresholdPercent: 0.5,
                }),
        ]);
    }
}
