import { ResponseDto } from "@app/api/response.dto";
import { ApiProperty } from "@nestjs/swagger";
import { Expose, plainToInstance, Transform, Type } from "class-transformer";
import { IsArray, IsBoolean, IsDate, IsDefined, IsEnum, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, Min, ValidateNested } from "class-validator";

export class ListAddOnsQueryDto {
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

export class ListAddOnsDto {
    @ApiProperty()
    @IsNotEmpty()
    @Expose()
    @Transform((params) => params.obj.id)
    id!: string;

    @ApiProperty({
        example: 'ADD-ONS-*****',
    })
    @IsString()
    @Expose()
    @IsNotEmpty()
    displayId: string;

    @ApiProperty({
        type: String,
        example: 'CCTV',
    })
    @IsString()
    @Expose()
    @IsDefined()
    name!: string;

    @ApiProperty({
        type: String,
        example: 'SECURITY',
    })
    @IsString()
    @Expose()
    @IsDefined()
    type!: string;

    @ApiProperty({
        type: Number,
        description: 'Add-Ons price',
        example: 200,
    })
    @IsNumber()
    @IsDefined()
    @IsNotEmpty()
    @Expose()
    price!: number;

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


export class AddOnsListResultDto {
    static parse(partial: Partial<AddOnsListResultDto>) {
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
        type: ListAddOnsDto,
        description: 'Add-Ons Data',
        isArray: true,
    })
    @Type(() => ListAddOnsDto)
    @IsArray()
    @Expose()
    @ValidateNested({ each: true })
    data!: ListAddOnsDto[];
}


export class AddOnsListResponseDto extends ResponseDto {
    @ApiProperty({
        type: AddOnsListResultDto,
        description: 'List of AddOns',
    })
    @IsObject()
    @ValidateNested({ each: true })
    @Expose()
    result!: AddOnsListResultDto;
}
