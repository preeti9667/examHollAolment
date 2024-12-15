import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsDefined, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";

export class AddonParamDto {
    @ApiProperty({
        type: String,
        description: 'unique identifier of addon',
        example: '13890811-23b6-409f-a753-7adedd90f2cf'
    })
    @IsUUID()
    @IsNotEmpty()
    id: string
}

export class EditAddOnsDto {
    @ApiProperty({
        required: true,
        description: 'Name of the AddOns',
        example: 'CCTV',
    })
    @IsDefined()
    @IsString()
    @IsOptional()
    name!: string;

    @ApiProperty({
        required: true,
        description: 'Add-Ons',
        example: 'SECURITY',
    })
    @IsDefined()
    @IsString()
    @IsOptional()
    type!: string;

    @ApiProperty({
        required: false,
        example: 'description'
    })
    @IsDefined()
    @IsString()
    @IsOptional()
    description!: string;

    @ApiProperty({
        type: Number,
        description: 'Add-Ons price',
        example: 200,
    })
    @IsNumber()
    @IsDefined()
    @IsOptional()
    price!: number;


    @ApiProperty({
        type: Boolean,
        example: true
    })
    @IsBoolean()
    @IsOptional()
    isActive: boolean
}
