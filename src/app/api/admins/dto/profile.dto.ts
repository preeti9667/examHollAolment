import { ResponseDto } from "@app/api/response.dto";
import { RoleDto } from "@app/api/role/dto/role.dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsObject, IsString, IsUUID } from "class-validator";

export class ProfileDto {
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
    })
    @IsString()
    displayId: string;


    @ApiProperty({
        type: String,
        example: 'Dr jai kal',
    })
    @IsString()
    name: string;

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
        example: 'abc@gmail.com',
    })
    @IsString()
    email: string;


    @ApiProperty({
        type: RoleDto,
    })
    @IsObject()
    role: RoleDto;

}

export class MyProfileResponseDto extends ResponseDto {
    @ApiProperty({
        type: ProfileDto,
    })
    result: ProfileDto;
}