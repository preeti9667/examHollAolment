import { ApiProperty } from "@nestjs/swagger";
import { BookingStatus } from "../booking.constant";
import { IsEnum, IsString, ValidateIf } from "class-validator";
import { ResponseDto } from "@app/api/api.dto";

export class BookingStatusPayloadDto {
    @ApiProperty({
        type: String,
        enum: [BookingStatus.Cancelled, BookingStatus.Completed],
        example: BookingStatus.Cancelled
    })
    @IsEnum([BookingStatus.Cancelled, BookingStatus.Completed])
    status: BookingStatus;

    @ApiProperty({
        type: String,
        example: 'cancelled by admin',
    })
    @ValidateIf((o) => o.status === BookingStatus.Cancelled)
    @IsString()
    reason: string;
}


export class BookingStatusResultDto {
    @ApiProperty({
        type: String,
        example: '3e9e93bd-ff1f-4c89-bd12-f09bb8b7f3d3',
        description: 'unique identifier of the booking'
    })
    id: string;

    @ApiProperty({
        type: String,
        example: 'BK-****',
    })
    displayId: string;

    @ApiProperty({
        type: Number,
        example: BookingStatus.Cancelled,
    })
    status: number;

}


export class BookingStatusResponseDto extends ResponseDto {
    @ApiProperty({
        type: BookingStatusResultDto,
    })
    result: BookingStatusResultDto;
}