import { ApiProperty } from "@nestjs/swagger";
import { IsUUID, IsString, IsNumber, IsEnum, IsArray, IsObject, ValidateNested, IsOptional, Min, IsDate } from "class-validator";
import { BookingStatus } from "../booking.constant";
import { Expose, plainToInstance, Type } from "class-transformer";
import { ResponseDto } from "@app/api/response.dto";
import { UtcToDateString } from "src/utils";


export class BookingListQueryDto {
    @ApiProperty({
        type: Number,
        description: 'page number',
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
}
export class BookingListBookingDetailDto {
    @ApiProperty({
        type: String,
        example: '3e9e93bd-ff1f-4c89-bd12-f09bb8b7f3d3',
    })
    @IsUUID()
    id: string;

    @ApiProperty({
        type: String,
    })
    @IsString()
    displayId: string;

    @ApiProperty({
        type: Number,
        enum: BookingStatus,
        example: BookingStatus.Draft
    })
    @IsNumber()
    @IsEnum(BookingStatus)
    status: number;

    @ApiProperty({
        type: Number,
    })
    @IsNumber()
    noOfCandidates: 1000;

    @ApiProperty({
        type: Number,
    })
    @IsNumber()
    hallAllocated: 4;

    @ApiProperty({
        type: String,
        example: '2024-11-10'
    })
    @UtcToDateString()
    @IsString()
    startDate: string;

    @ApiProperty({
        type: String,
        example: '2024-11-25'
    })
    @UtcToDateString()
    @IsString()
    endDate: string;

    @ApiProperty({
        type: Date,
        example: '2024-11-10T16:51:29.834Z'
    })
    @IsDate()
    createdAt: Date;

    @ApiProperty({
        type: Date,
        example: '2024-11-10T16:51:29.834Z'
    })
    @IsDate()
    updatedAt: Date;
}


export class BookingListResultDto {
    static parse(partial: Partial<BookingListBookingDetailDto>) {
        return plainToInstance(this, partial, { excludeExtraneousValues: true });
    }

    @ApiProperty({
        type: Number,
        description: 'total count of records',
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
        type: BookingListBookingDetailDto,
        description: 'booking Data',
        isArray: true,
    })
    @Type(() => BookingListBookingDetailDto)
    @IsArray()
    @Expose()
    @ValidateNested({ each: true })
    data!: BookingListBookingDetailDto[];
}


export class BookingListResponseDto extends ResponseDto {
    @ApiProperty({
        type: BookingListResultDto,
    })
    @IsObject()
    @ValidateNested({ each: true })
    @Expose()
    @Type(() => BookingListResultDto)
    result!: BookingListResultDto;
}