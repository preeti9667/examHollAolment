import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional, IsEmail, IsNotEmpty, IsObject } from "class-validator";
import { UserType } from "../user.constant";
import { ResponseDto } from "@app/api/api.dto";

export class CreateUserPayloadDto {
    @ApiProperty({
        type: String,
        example: 'saini dev',
        required: true
    })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({
        type: String,
        example: '+91',
        required: false
    })
    @IsOptional()
    @IsString()
    countryCode: string;

    @ApiProperty({
        type: String,
        example: '988250000',
        required: false
    })
    @IsOptional()
    @IsString()
    phoneNumber: string;

    @ApiProperty({
        type: String,
        required: true,
        example: 'something about you'
    })
    @IsOptional()
    @IsString()
    bio: string;

    @ApiProperty({
        type: String,
        required: true,
        example: 'saini dev'
    })
    @IsOptional()
    @IsString()
    institutionType: string;

    @ApiProperty({
        type: String,
        required: false,
        example: '1234567890'
    })
    @IsString()
    @IsOptional()
    gstNo?: string;

    @ApiProperty({
        type: String,
        required: false,
        example: 'Dr'
    })
    @IsString()
    @IsOptional()
    jobTitle?: string;

    @ApiProperty({
        type: String,
        required: false,
        example: 'The Fastest'
    })
    @IsString()
    @IsOptional()
    organizationName?: string;

    @ApiProperty({
        type: String,
        required: false,
        example: 'fastest@email.com'
    })
    @IsEmail()
    @IsOptional()
    email?: string;
}


export class CreateUserResultDto {
    @ApiProperty({
        type: String,
        example: '3e9e93bd-ff1f-4c89-bd12-f09bb8b7f3d3',
        required: true,
        description: 'request id that you need to send with otp in next api',
    })
    @IsString()
    requestId: string;

    @ApiProperty({
        type: String,
        example: UserType.User,
        required: true
    })
    @IsString()
    type: UserType;
}


export class CreateUserResponseDto extends ResponseDto {
    @ApiProperty({
        type: CreateUserResultDto,
    })
    @IsObject()
    result: CreateUserResultDto;
}