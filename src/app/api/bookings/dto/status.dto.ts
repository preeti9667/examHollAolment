import { ApiProperty } from "@nestjs/swagger";
import { BookingStatus } from "../booking.constant";
import { IsEnum, IsString, ValidateIf } from "class-validator";

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