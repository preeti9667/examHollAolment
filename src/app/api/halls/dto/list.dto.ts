import { ResponseDto } from "@app/api/response.dto";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, plainToInstance, Transform, Type } from "class-transformer";
import { IsArray, IsBoolean, IsDate, IsDefined, IsEnum, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, Min, ValidateNested } from "class-validator";

export class ListHallQueryDto {
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
    limit: number;

    @ApiProperty({
        required: false,
        enum: ['createdAt'],
        default: 'createdAt',
    })
    @IsOptional()
    @IsEnum(['createdAt'])
    sortBy?: 'createdAt';

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
}

export class SlotDto {
    @ApiProperty({
        example: '09:00 AM',
        description: 'Slot start time in 12-hour format',
    })
    @IsString()
    @IsNotEmpty()
    @Expose()
    from!: string;

    @ApiProperty({
        example: '12:00 PM',
        description: 'Slot end time in 12-hour format',
    })
    @IsString()
    @IsNotEmpty()
    @Expose()
    to!: string;
}

export class ListHallDto {
    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    @Transform((params) => params.obj.id)
    id!: string;

    @ApiProperty({
        example: 'HALL-*****',
    })
    @IsString()
    @IsNotEmpty()
    displayId: string;

    @ApiProperty({
        type: String,
        example: 'HALL_001',
    })
    @IsString()
    @Expose()
    @IsDefined()
    name!: string;

    @ApiProperty({
        type: String,
        example: 'A',
    })
    @IsString()
    @Expose()
    @IsDefined()
    groupName!: string;

    @ApiProperty({
        type: Number,
        description: 'Hall capacity',
        example: 200,
    })
    @IsNumber()
    @IsDefined()
    @IsNotEmpty()
    @Expose()
    capacity!: number;

    @ApiProperty({
        required: true,
        isArray: true,
        type: SlotDto,
        description: 'Array of slot details',
    })
    @IsArray()
    @IsDefined()
    @Expose()
    @ValidateNested({ each: true })
    @Type(() => SlotDto)
    slots!: SlotDto[];

    @ApiProperty({
        required: true,
        type: Boolean,
    })
    @IsBoolean()
    @IsDefined()
    @Expose()
    isActive!: boolean;

    @ApiProperty({
        type: String,
        example: '2024-08-21T11:24:09.857Z',
    })
    @IsDate()
    @Expose()
    @IsDefined()
    createdAt!: Date;

    @ApiProperty({
        type: String,
        example: '2024-08-21T11:24:09.857Z',
    })
    @IsDate()
    @Expose()
    @IsDefined()
    updatedAt!: Date;
}


export class HallListResultDto {
    static parse(partial: Partial<HallListResultDto>) {
        return plainToInstance(this, partial, { excludeExtraneousValues: true });
    }

    @ApiProperty({
        type: Number,
        description: 'total count',
    })
    @Expose()
    total: number;

    @ApiProperty({
        type: Number,
        description: 'current page',
    })
    @Expose()
    page: number;

    @ApiProperty({
        type: Number,
        description: 'documents per page',
    })
    @Expose()
    limit: number;

    @ApiProperty({
        type: ListHallDto,
        description: 'Hall Data',
        isArray: true,
    })
    @Type(() => ListHallDto)
    @IsArray()
    @Expose()
    @ValidateNested({ each: true })
    data!: ListHallDto[];
}


export class HallListResponseDto extends ResponseDto {
    @ApiProperty({
        type: HallListResultDto,
        description: 'List of halls',
    })
    @IsObject()
    @ValidateNested({ each: true })
    @Expose()
    result!: HallListResultDto;
}
