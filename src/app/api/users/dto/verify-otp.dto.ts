import { ResponseDto } from "@app/api/api.dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsObject, IsString, IsUUID } from "class-validator";

export class CreateUserVerifyOtpDto {
    @ApiProperty({
        type: String,
        required: true,
        example: '123456'
    })
    @IsNotEmpty()
    @IsString()
    otp: string;


    @ApiProperty({
        type: String,
        example: '3e9e93bd-ff1f-4c89-bd12-f09bb8b7f3d3',
    })
    @IsUUID()
    @IsNotEmpty()
    requestId: string;
}


export class CreateUserVerifyOtpResultDto {
    @ApiProperty({
        type: String,
        example: '3e9e93bd-ff1f-4c89-bd12-f09bb8b7f3d3',
        description: 'unique identifier of the user'
    })
    @IsUUID()
    @IsNotEmpty()
    id: string;

    @ApiProperty({
        type: String,
        example: 'USR-1234',
    })
    @IsString()
    displayId: string;
}


export class CreateUserVerifyOtpResponseDto extends ResponseDto {
    @ApiProperty({
        type: CreateUserVerifyOtpResultDto,
    })
    @IsObject()
    result: CreateUserVerifyOtpResultDto;
}