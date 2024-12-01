import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class LinkPaymentQueryDto {
    @ApiProperty({
        type: String,
        required: true
    })
    @IsString()
    bookingId: string;
}