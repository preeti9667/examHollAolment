import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsUUID } from "class-validator";

export class VerifyOtpPayloadDto {
    @ApiProperty({
        type: String,
        description: 'request_id that you have received in send otp api'
    })
    @IsString()
    @IsUUID()
    request_id: string;

    @ApiProperty({
        type: String,
        example: '000000'
    })
    @IsString()
    otp: string;
}