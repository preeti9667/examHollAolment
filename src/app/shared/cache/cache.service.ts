import { RedisService } from "@app/databases/redis/redis.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CacheService {
    constructor(private $redis: RedisService) { }

    async hSet(tag: string, id: string, value: any): Promise<boolean> {
        return await this.$redis.hSet(tag, id, value);
    }


    async hGet(tag: string, id: string): Promise<any> {
        return await this.$redis.hGet(tag, id);
    }


    async set(tag: string, id: string, value: any): Promise<boolean> {
        return await this.$redis.set(tag, id, value);

    }

    async setEx(tag: string, id: string, value: any, ttl = 1000): Promise<boolean> {
        return await this.$redis.setEx(tag, id, value, ttl);
    }


    async get(tag: string, id: string): Promise<any> {
        return await this.$redis.get(tag, id);

    }
    async mSet(data: { [key: string]: string }[]): Promise<boolean> {
        return await this.$redis.mSet(data);
    }

    async mDel(keys: string[]): Promise<boolean> {
        return await this.$redis.mDel(keys);
    }
}