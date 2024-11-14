import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional, Length } from "class-validator";

export class UserAddressDto {

    @ApiProperty({
        type: String,
        example: '3e9e93bd-ff1f-4c89-bd12-f09bb8b7f3d4',
        required: false
    })
    @IsOptional()
    @IsString()
    id: string;

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