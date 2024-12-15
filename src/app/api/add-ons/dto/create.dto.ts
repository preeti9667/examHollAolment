import { ResponseDto } from '@app/api/api.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDefined, IsNotEmpty, IsNumber, IsEnum, IsBoolean, IsOptional } from 'class-validator';

export class CreateAddOnsDto {

    @ApiProperty({
        required: true,
        description: 'Name of the AddOns',
        example: 'CCTV',
    })
    @IsDefined()
    @IsString()
    @IsNotEmpty()
    name!: string;

    @ApiProperty({
        required: true,
        description: 'Add-Ons',
        example: 'SECURITY',
    })
    @IsDefined()
    @IsString()
    @IsNotEmpty()
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
    @IsNotEmpty()
    price!: number;


    @ApiProperty({
        type: Boolean,
        example: true
    })
    @IsBoolean()
    @IsNotEmpty()
    isActive: boolean
}

export class CreateAddOnsResponseDto extends ResponseDto {
    @ApiProperty({
        type: Boolean,
        description: 'Status',
    })
    result!: boolean;
}
