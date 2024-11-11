import { ResponseDto } from "@app/api/response.dto";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsObject, IsOptional, IsString, Length } from "class-validator";


export class UpdateProfileAddressDto {

    @ApiProperty({
        type: String,
        example: 'gali no 10',
        required: false
    })
    street?: string;

    @ApiProperty({
        type: String,
        example: '232, F block, sector 51',
        required: false
    })
    @IsString()
    @IsOptional()
    addressLine?: string;

    @ApiProperty({
        type: String,
        example: '301203',
        required: true
    })
    @IsString()
    @Length(6, 6)
    pincode: string;

    @ApiProperty({
        type: String,
        example: 'Delhi',
        required: true
    })
    @IsString()
    city: string;

    @ApiProperty({
        type: String,
        example: 'Delhi',
        required: true
    })
    @IsString()
    state: string
}

export class UpdateProfilePayloadDto {
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
        type: UpdateProfileAddressDto,
        required: true
    })
    @IsObject()
    @Type(() => UpdateProfileAddressDto)
    address: UpdateProfileAddressDto;
}


export class UpdateProfileResultDto extends UpdateProfilePayloadDto {
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
}


export class UpdateProfileResponseDto extends ResponseDto {
    @ApiProperty({
        type: UpdateProfileResultDto,
        required: true
    })
    @IsObject()
    @Type(() => UpdateProfileResultDto)
    result: UpdateProfileResultDto;
}