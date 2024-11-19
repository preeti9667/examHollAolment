import { ResponseDto } from "@app/api/response.dto";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsEmail, IsString, IsUUID } from "class-validator";

export class CreateAdminPayloadDto {
    @ApiProperty({
        type: String,
        example: 'Dr jacal',
        required: true
    })
    @IsString()
    name: string;

    @ApiProperty({
        type: String,
        example: '9882550000',
        required: true
    })
    @IsString()
    phoneNumber: string;

    @ApiProperty({
        type: String,
        example: '+91',
        required: true
    })
    @IsString()
    countryCode: string;

    @ApiProperty({
        type: String,
        example: 'dev@gmail.com',
        required: true
    })
    @IsEmail()
    email: string;


    @ApiProperty({
        type: String,
        required: true,
        example: '3e9e93bd-ff1f-4c89-bd12-f09bb8b7f3d3'
    })
    @IsUUID()
    roleId: string
}


export class CreateAdminResultDto extends CreateAdminPayloadDto {
    @ApiProperty({
        type: String,
        example: '3e9e93bd-ff1f-4c89-bd12-f09bb8b7f3d3',
        required: true
    })
    @IsUUID()
    id: string;

    @ApiProperty({
        type: String,
        example: 'USR-****',
        required: true
    })
    @IsString()
    displayId: string;


    @ApiProperty({
        type: Date,
        example: new Date().toISOString(),
    })
    @IsDate()
    createdAt: Date;

    @ApiProperty({
        type: Date,
        example: new Date().toISOString(),
    })
    @IsDate()
    updatedAt: Date;
}




export class CreateAdminResponseDto extends ResponseDto {
    @ApiProperty({
        type: CreateAdminResultDto
    })
    @Type(() => CreateAdminResultDto)
    result: CreateAdminResultDto
}