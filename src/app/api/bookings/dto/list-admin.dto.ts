import { ListQueryDto, PaginateResultDto, ResponseDto } from "@app/api/api.dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { BookingStatus } from "../booking.constant";
import { Type } from "class-transformer";
import { BookingListBookingDetailDto } from "./list.dto";
import { ClassSerializerInterceptor } from "@nestjs/common";

export class BookingListAdminQueryDto extends ListQueryDto {
    @ApiProperty({
        type: String,
        enum: ['displayId', 'startDate', 'endDate', 'createdAt', 'totalCost'],
    })
    @IsString()
    @IsEnum(['displayId', 'startDate', 'endDate', 'createdAt', 'totalCost'])
    sortBy?: string;


    @ApiProperty({
        type: Number,
        enum: BookingStatus
    })
    @IsOptional()
    @IsNumber()
    @IsEnum(BookingStatus)
    @Type(() => Number)
    status?: number
}


export class BookingListAdminBookingDetailDto extends BookingListBookingDetailDto {
    @ApiProperty({
        type: Number,
        example: 20000
    })
    @IsNumber()
    totalCost: number;

    @ApiProperty({
        type: String,
        example: 'jhon smith'
    })
    @IsNumber()
    applicantName: string;

    @ApiProperty({
        type: String,
        example: 'BSEB - Bihar Government.'
    })
    @IsNumber()
    examName: string;

    @ApiProperty({
        type: String,
        example: 'BSEB - Bihar Government.'
    })
    @IsNumber()
    organizationName: string;

}


export class BookingListAdminResultDto extends PaginateResultDto {
    @ApiProperty({
        type: [BookingListAdminBookingDetailDto],
        example: []
    })
    @IsOptional()
    @Type(() => BookingListAdminBookingDetailDto)
    data: BookingListAdminBookingDetailDto[];
}

export class BookingListAdminResponseDto extends ResponseDto {
    @ApiProperty({
        type: BookingListAdminResultDto
    })
    @Type(() => BookingListAdminResultDto)
    result: BookingListAdminResultDto
}