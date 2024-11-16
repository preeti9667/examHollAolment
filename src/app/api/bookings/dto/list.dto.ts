import { ApiProperty } from "@nestjs/swagger";
import { IsUUID, IsString, IsNumber, IsEnum, IsArray, IsObject, ValidateNested } from "class-validator";
import { BookingStatus } from "../booking.constant";
import { Expose, plainToInstance, Type } from "class-transformer";
import { ResponseDto } from "@app/api/response.dto";

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