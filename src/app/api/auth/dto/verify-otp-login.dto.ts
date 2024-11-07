import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsUUID } from "class-validator";

export class VerifyOtpLoginPayloadDto {
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


export class VerifyOtpUserDto {
    @ApiProperty({
        type: String,
        example: '2e9e93bd-ff1f-4c89-bd12-f09bb8b7f3d3'
    })
    @IsString()
    id: string;
}

export class VerifyOtpResultDto {

}