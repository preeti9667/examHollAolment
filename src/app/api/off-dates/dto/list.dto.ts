import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsNumber, Min, Max, IsEnum } from "class-validator";
import { UtcToDateString } from "src/utils";

export class OffDateListQueryDto {
    @ApiProperty({
        type: Number,
        description: 'Page number',
        required: false,
        default: 1,
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    page: number;

    @ApiProperty({
        type: Number,
        description: 'Records per page',
        required: false,
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Max(100)
    limit: number;

    @ApiProperty({
        required: false,
        enum: ['createdAt'],
        default: 'createdAt',
    })
    @IsOptional()
    @IsEnum(['createdAt'])
    sortBy?: string;

    @ApiProperty({
        type: String,
        description: 'Sorting order asc|dsc',
        required: false,
        enum: ['asc', 'desc'],
        default: 'desc',
    })
    @IsEnum(['asc', 'desc'])
    @IsOptional()
    sort: 'asc' | 'desc';
}


export class OffDateListDetailsDto {
    @ApiProperty({
        type: String
    })
    @UtcToDateString()
    date: String;
}