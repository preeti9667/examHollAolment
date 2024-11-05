import { Expose, Transform } from 'class-transformer';
import { IsDefined, IsNumber, IsOptional, IsString } from 'class-validator';

export class RedisConfig {
    @IsDefined()
    @IsString()
    readonly HOST: string;

    @IsDefined()
    @IsNumber()
    readonly PORT: number;

    @IsDefined()
    @IsNumber()
    readonly DB: number;

    @IsDefined()
    @IsString()
    @IsOptional()
    readonly PASSWORD: string;

    @Expose()
    @Transform(
        ({ obj }: { obj: RedisConfig }) => `redis://${obj.HOST}:${obj.PORT}`,
    )
    readonly URI: string;
}
