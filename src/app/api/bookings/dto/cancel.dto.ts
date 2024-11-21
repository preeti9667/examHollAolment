import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString, IsUUID } from "class-validator";
import { BookingStatus } from "../booking.constant";
import { ResponseDto } from "@app/api/api.dto";
import { Type } from "class-transformer";

export class CancelBookingDto {
    @ApiProperty({
        type: String,
        example: 'Exam is postponed',
    })
    @IsString()
    reason: string;
}


export class CancelBookingResultDto {

    @ApiProperty({
        type: String,
        example: '3e9e93bd-ff1f-4c89-bd12-f09bb8b7f3d3',
    })
    @IsUUID()
    id: string

    @ApiProperty({
        type: String,
        example: 'BK-****',
    })
    @IsString()
    displayId: string

    @ApiProperty({
        type: String,
        example: BookingStatus.Cancelled,
    })
    @IsNumber()
    status: number;
}

export class CancelBookingResponseDto extends ResponseDto {
    @ApiProperty({
        type: CancelBookingResultDto
    })
    @Type(() => CancelBookingResultDto)
    result: CancelBookingResultDto
}