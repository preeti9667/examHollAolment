import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional, IsObject } from "class-validator";
import { UserAddressDto } from "./address.dto";
import { Type } from "class-transformer";
import { ResponseDto } from "@app/api/response.dto";

export class UserProfileDto {
    @ApiProperty({
        type: String,
        example: '3e9e93bd-ff1f-4c89-bd12-f09bb8b7f3d3',
        required: true
    })
    @IsString()
    id: string;


    @ApiProperty({
        type: String,
        example: 'USR-****',
    })
    displayId: string


    @ApiProperty({
        type: String,
        example: '9882550000',
    })
    @IsString()
    phoneNumber: string;

    @ApiProperty({
        type: String,
        example: '+91',
    })
    @IsString()
    countryCode: string;

    @ApiProperty({
        type: String,
        required: false,
        example: 'dev@gmail.com'
    })
    email: string;


    @ApiProperty({
        type: String,
        example: 'saini dev',
        required: true
    })
    @IsString()
    name: string;

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
        required: false,
        example: '1234567890'
    })
    @IsString()
    @IsOptional()
    gstNo?: string;


    @ApiProperty({
        type: Date,
        example: '2023-01-01T00:00:00.000Z',
    })
    @IsString()
    createdAt: Date;

    @ApiProperty({
        type: Date,
        example: '2024-11-01T00:00:00.000Z',
    })
    @IsString()
    updatedAt: Date;


    @ApiProperty({
        type: UserAddressDto,
        required: true
    })
    @IsObject()
    @Type(() => UserAddressDto)
    address: UserAddressDto;
}


export class ProfileDetailsResponseDto extends ResponseDto {
    @ApiProperty({
        type: UserProfileDto
    })
    @IsObject()
    @Type(() => UserProfileDto)
    result: UserProfileDto
}