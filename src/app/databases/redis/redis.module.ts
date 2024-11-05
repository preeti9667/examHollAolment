import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { LoggerModule } from '@app/shared/logger';
import { EnvModule } from '@app/shared/env/env.module';

@Module({
    imports: [
        EnvModule,
        LoggerModule.register({
            context: RedisModule.name
        })
    ],
    providers: [RedisService],
    exports: [RedisService]
})
export class RedisModule { }
