import { RedisModule } from "@app/databases/redis/redis.module";
import { Module } from "@nestjs/common";
import { CacheService } from "./cache.service";

@Module({
    imports: [RedisModule],
    providers: [CacheService],
    exports: [CacheService]
})
export class CacheModule { }