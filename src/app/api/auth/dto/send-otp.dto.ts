import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class SendOtpPayloadDto {
    @ApiProperty({
        type: String,
        example: '9882550000'
    })
    @IsString()
    phone_number: string;

    @ApiProperty({
        type: String,
        example: '+91',
        default: '+91'
    })
    @IsString()
    @IsOptional()
    country_code: string
}


export class SendOtpResultDto {
    @ApiProperty({
        type: String,
    })
    @IsString()
    request_id: string;
}

