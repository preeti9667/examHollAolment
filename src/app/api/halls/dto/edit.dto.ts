import { ResponseDto } from '@app/api/api.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDefined, IsMongoId, IsArray, IsNotEmpty, IsNumber, IsBoolean, IsOptional, IsUUID } from 'class-validator';


export class HallParamDto {
    @ApiProperty({
        type: String,
        required: true,
        example: '5f7c2c4d-6b2a-4f1a-8b7b-3c1a2b3a4c1a',
        description: 'unique id of the Hall'
    })
    @IsNotEmpty()
    @IsUUID()
    id: string;
}
export class EditHallDto {

    @ApiProperty({
        required: true,
        description: 'Name of the Hall',
        example: 'HALL_001',
    })
    @IsString()
    @IsOptional()
    name!: string;

    @ApiProperty({
        required: true,
        description: 'Group name',
        example: 'Group A',
    })
    @IsDefined()
    @IsString()
    @IsOptional()
    groupName!: string;

    @ApiProperty({
        type: Number,
        description: 'Hall capacity',
        example: 200,
    })
    @IsNumber()
    @IsOptional()
    capacity!: number;

    @ApiProperty({
        type: Number,
        description: 'Floor number, 0 for ground, 1 for first floor',
        example: 0,
    })
    @IsNumber()
    @IsOptional()
    floor!: number;

    @ApiProperty({
        type: Number,
        description: 'Hall Pice',
        example: 20000,
    })
    @IsNumber()
    @IsOptional()
    price!: number;

    @ApiProperty({
        required: true,
        isArray: true,
        type: String,
        description: 'Slots Ids',
        example: ['1b53c972-bdc7-4cfb-bf86-90a55e8b95ae'],
    })
    @IsArray()
    @IsOptional()
    slots!: string[];

    @ApiProperty({
        required: true,
        type: Boolean,
    })
    @IsBoolean()
    @IsOptional()
    isActive!: boolean;
}

export class EditHallResponseDto extends ResponseDto {
    @ApiProperty({
        type: Boolean,
        description: 'Status',
    })
    result!: boolean;
}
