import { ResponseDto } from '@app/api/response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { AddOnType } from '@prisma/client';
import { IsString, IsDefined, IsNotEmpty, IsNumber, IsEnum } from 'class-validator';

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
        example: AddOnType.SECURITY,
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
}

export class CreateAddOnsResponseDto extends ResponseDto {
    @ApiProperty({
      type: Boolean,
      description: 'Status',
    })
    result!: boolean;
  }
  