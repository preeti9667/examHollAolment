import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional, IsEmail, IsNotEmpty } from "class-validator";

export class CreateUserDto {
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