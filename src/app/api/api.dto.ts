import { ApiProperty } from "@nestjs/swagger";
import { Type, Transform } from "class-transformer";
import { IsOptional, IsNumber, Min, IsEnum, IsBoolean, IsString, Max } from "class-validator";

export class ResponseDto {
    @ApiProperty({
        type: Number,
        example: 200
    })
    status: number;

    @ApiProperty({
        type: String,
        example: "Success"
    })
    message: number;

    @ApiProperty({
        type: Object,
    })
    result: any;
}

export class ListQueryDto {
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

    @ApiProperty({
        description: 'boolean value true or false',
        type: String,
        enum: ['true', 'false'],
        required: false,
    })
    @IsOptional()
    @IsBoolean()
    @Transform(({ obj, key }) => {
        return obj[key] === 'true' ? true : obj[key] === 'false' ? false : obj[key];
    })
    isActive?: string;


    @ApiProperty({
        type: String,
        description: 'search some thing eg. name',
        required: false,
    })
    @IsString()
    @IsOptional()
    search?: string;
}