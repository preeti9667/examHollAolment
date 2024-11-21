import { ResponseDto } from '@app/api/api.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDefined, IsMongoId, IsArray, IsNotEmpty, IsNumber, IsBoolean } from 'class-validator';

export class CreateHallDto {

    @ApiProperty({
        required: true,
        description: 'Name of the Hall',
        example: 'HALL_001',
    })
    @IsDefined()
    @IsString()
    @IsNotEmpty()
    name!: string;

    @ApiProperty({
        required: true,
        description: 'Group name',
        example: 'Group A',
    })
    @IsDefined()
    @IsString()
    @IsNotEmpty()
    groupName!: string;

    @ApiProperty({
        type: Number,
        description: 'Hall capacity',
        example: 200,
    })
    @IsNumber()
    @IsDefined()
    @IsNotEmpty()
    capacity!: number;

    @ApiProperty({
        type: Number,
        description: 'Floor number, 0 for ground, 1 for first floor',
        example: 0,
    })
    @IsNumber()
    @IsDefined()
    @IsNotEmpty()
    floor!: number;

    @ApiProperty({
        type: Number,
        description: 'Hall Pice',
        example: 20000,
    })
    @IsNumber()
    @IsDefined()
    @IsNotEmpty()
    price!: number;

    @ApiProperty({
        required: true,
        isArray: true,
        type: String,
        description: 'Add-Ons associated with the hall',
    })
    @IsArray()
    @IsDefined()
    addOnIds!: string[];

    @ApiProperty({
        required: true,
        isArray: true,
        type: String,
        description: 'Slots Ids',
    })
    @IsArray()
    @IsDefined()
    slots!: string[];

    @ApiProperty({
        required: true,
        type: Boolean,
    })
    @IsBoolean()
    @IsDefined()
    isActive!: boolean;
}

export class CreateHallResponseDto extends ResponseDto {
    @ApiProperty({
        type: Boolean,
        description: 'Status',
    })
    result!: boolean;
}
