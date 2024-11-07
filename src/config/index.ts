import { IsDefined, IsNumber, IsObject, IsOptional, IsString, Min, ValidateNested } from "class-validator";
import { RedisConfig } from "./redis.config";
import { Type } from "class-transformer";
import { SecretConfig } from "./secret.config";

export class EnvConfig {
    @IsDefined()
    @IsString()
    NODE_ENV!: string;

    @IsDefined()
    @IsNumber()
    @Min(100)
    PORT!: number;

    // @IsDefined()
    // @IsObject()
    // @ValidateNested()
    @IsOptional()
    @Type(() => RedisConfig)
    REDIS: RedisConfig;

    @IsDefined()
    @IsObject()
    @ValidateNested()
    @IsOptional()
    @Type(() => SecretConfig)
    SECRETS: SecretConfig;


    @IsOptional()
    BYPASS_OTP: string;
}