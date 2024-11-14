import { ResponseDto } from '@app/api/response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDefined, IsNotEmpty, IsNumber, IsEnum, IsBoolean } from 'class-validator';
import { AddOnType } from '../add-on.constant';

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
        example: AddOnType.Security,
        enum: AddOnType,
    })
    @IsDefined()
    @IsEnum(AddOnType)
    @IsNotEmpty()
    type!: AddOnType;

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
