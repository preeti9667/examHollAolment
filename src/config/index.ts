import { IsDefined, IsNumber, IsObject, IsOptional, IsString, Min, ValidateNested } from "class-validator";
import { RedisConfig } from "./redis.config";
import { Expose, Transform, Type } from "class-transformer";
import { resolve } from "path";
import { readFileSync } from "fs";

export class EnvConfig {
    @IsDefined()
    @IsString()
    NODE_ENV!: string;

    @IsDefined()
    @IsNumber()
    @Min(100)
    PORT!: number;

    @IsDefined()
    @IsString()
    @IsOptional()
    readonly REDIS_HOST: string;

    @IsDefined()
    @IsNumber()
    @IsOptional()
    readonly REDIS_PORT: number;

    @IsDefined()
    @IsNumber()
    @IsOptional()
    readonly REDIS_DB: number;

    @IsDefined()
    @IsString()
    @IsOptional()
    readonly REDIS_PASSWORD: string;


    @IsDefined()
    @IsString()
    SECRETS_PASSWORD_TOKEN: string;

    @IsDefined()
    @IsString()
    SECRETS_REFRESH_TOKEN: string;

    @IsDefined()
    @IsString()
    SECRETS_AUTH_TOKEN: string;
    // @IsDefined()
    // @IsString()
    // MFA_TOKEN: string;
    @Expose()
    @Transform(() =>
        readFileSync(resolve(__dirname, '../../secrets/jwt-private.pem'), 'utf8'),
    )
    SECRETS_PRIVATE_KEY: string;

    @Expose()
    @Transform(() =>
        readFileSync(resolve(__dirname, '../../secrets/jwt-public.pem'), 'utf8'),
    )
    SECRETS_PUBLIC_KEY: string;

    @IsOptional()
    BYPASS_OTP: string;



    @IsString()
    @IsDefined()
    SABPAISA_CLIENT_CODE: string;
    @IsString()
    @IsDefined()
    SABPAISA_TRANS_USER_NAME: string;
    @IsString()
    @IsDefined()
    SABPAISA_TRANS_USER_PASSWORD: string;
    @IsString()
    @IsDefined()
    SABPAISA_AUTH_KEY: string;
    @IsString()
    @IsDefined()
    SABPAISA_AUTH_IV: string;
    @IsString()
    @IsDefined()
    SABPAISA_MCC: string;
    @IsString()
    @IsDefined()
    SABPAISA_URL: string;
    @IsString()
    @IsDefined()
    SUBPAISA_CALLBACK_URL: string;

    @IsString()
    @IsDefined()
    REDIRECT_URL_PAYMENT: string;

    @IsString()
    @IsDefined()
    MSG91_USERNAME: string;

    @IsString()
    @IsDefined()
    MAS91_PASSWORD: string;

    @IsString()
    @IsDefined()
    MSG91_SENDER_ID: string;

    @IsString()
    @IsDefined()
    MSG91_SECURE_KEY: string;
}