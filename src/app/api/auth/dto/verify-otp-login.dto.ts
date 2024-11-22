import { ResponseDto } from "@app/api/api.dto";
import { ApiProperty } from "@nestjs/swagger";
import { AccountType } from "@prisma/client";
import { IsBoolean, IsString, IsUUID } from "class-validator";

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
    @ApiProperty({
        type: Boolean,
        example: true
    })
    @IsBoolean()
    isNew: string

    @ApiProperty({
        type: String,
        enum: AccountType
    })
    @IsString()
    type: AccountType;


    @ApiProperty({
        type: String,
    })
    @IsString()
    token: string
}



export class VerifyOtpLoginResponseDto extends ResponseDto {
    @ApiProperty({
        type: VerifyOtpResultDto
    })
    result: VerifyOtpResultDto;
}