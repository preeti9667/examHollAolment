import { ResponseDto } from "@app/api/api.dto";
import { ApiProperty } from "@nestjs/swagger";
import { AccountType } from "@prisma/client";
import { IsBoolean, IsObject, IsOptional, IsString } from "class-validator";

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
        example: '2e9e93bd-ff1f-4c89-bd12-f09bb8b7f3d3'
    })
    @IsString()
    request_id: string;

    @ApiProperty({
        type: String,
        enum: AccountType
    })
    @IsString()
    type: AccountType;
}

export class SendOtpResponseDto extends ResponseDto {
    @ApiProperty({
        type: SendOtpResultDto
    })
    @IsObject()
    result: SendOtpResultDto;
}

