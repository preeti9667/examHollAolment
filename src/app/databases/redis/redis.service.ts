import { HttpException, Injectable, Logger } from "@nestjs/common";
import Redis from "ioredis";
import { EnvService } from "@app/shared/env";
import { LoggerService } from "@app/shared/logger";
@Injectable()
export class RedisService {
    private redis: Redis;
    constructor(
        private $env: EnvService,
        private $logger: LoggerService

    ) {
        this.connect();
    }
    private connect() {
        const host = this.$env.REDIS.HOST;
        const port = this.$env.REDIS.PORT;
        const password = this.$env.REDIS.PASSWORD;
        this.redis = new Redis({
            host,
            port,
            password
        });
    }

    async hSet(tag: string, id: string, value: any): Promise<boolean> {
        try {
            const v = JSON.stringify(value);
            await this.redis.hset(tag, id, v);
            return true;
        } catch (error) {
            this.$logger.error("ERROR to Set Data", error.stack, error.context);
            throw new HttpException(error?.response, error?.status);
        }
    }


    async hGet(tag: string, id: string): Promise<any> {
        try {
            const data = await this.redis.hget(tag, id);
            return data;
        } catch (error) {
            this.$logger.error("ERROR to Get Data", error.stack, error.context);
            throw new HttpException(error?.response, error?.status);
        }
    }


    async set(tag: string, id: string, value: any): Promise<boolean> {
        try {
            const v = JSON.stringify(value);
            await this.redis.set(`${tag}_${id}`, v,);
            return true;
        } catch (error) {
            this.$logger.error("ERROR to Set Data", error.stack, error.context);
            throw new HttpException(error?.response, error?.status);
        }
    }
    async setEx(tag: string, id: string, value: any, ttl = 1000): Promise<boolean> {
        try {
            const v = JSON.stringify(value);
            await this.redis.setex(`${tag}_${id}`, ttl, v);
            return true;
        } catch (error) {
            this.$logger.error("ERROR to Set Data", error.stack, error.context);
            throw new HttpException(error?.response, error?.status);
        }
    }


    async get(tag: string, id: string): Promise<any> {
        try {
            const key = `${tag}_${id}`;
            const data = await this.redis.get(key);
            return JSON.parse(data);
        } catch (error) {
            this.$logger.error("ERROR to Get Data", error.stack, error.context);
            throw new HttpException(error?.response, error?.status);
        }
    }
    async mSet(data: { [key: string]: string }[]): Promise<boolean> {
        try {
            await this.redis.mset(data);
            return true;
        } catch (error) {
            this.$logger.error("ERROR to Set Data", error.stack, error.context);
            throw new HttpException(error?.response, error?.status);
        }
    }

    async mDel(keys: string[]): Promise<boolean> {
        try {
            if (keys.length > 0) {
                await this.redis.del(keys);
            }
            return true;
        } catch (error) {
            this.$logger.error("ERROR to delete Data", error.stack, error.context);
            throw new HttpException(error?.response, error?.status);
        }
    }



}