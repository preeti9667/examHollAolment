import { IsDefined, IsNumber, IsObject, IsString, Min, ValidateNested } from "class-validator";
import { RedisConfig } from "./redis.config";
import { Type } from "class-transformer";

export class EnvConfig {
    @IsDefined()
    @IsString()
    NODE_ENV!: string;

    @IsDefined()
    @IsNumber()
    @Min(100)
    PORT!: number;

    @IsDefined()
    @IsObject()
    @ValidateNested()
    @Type(() => RedisConfig)
    REDIS: RedisConfig
}