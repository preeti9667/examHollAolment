import { ListQueryDto, PaginateResultDto, ResponseDto } from "@app/api/api.dto";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsNumber, Min, Max, IsEnum, IsString } from "class-validator";
import { from } from "rxjs";
import { UtcToDateString } from "src/utils";

export class OffDateListQueryDto {
    @ApiProperty({
        type: Number,
        description: 'Page number',
        required: false,
        default: 1,
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    page: number;

    @ApiProperty({
        type: Number,
        description: 'Records per page',
        required: false,
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Max(100)
    limit: number;

    @ApiProperty({
        required: false,
        enum: ['createdAt', 'date'],
        default: 'createdAt',
    })
    @IsOptional()
    @IsEnum(['createdAt', 'date'])
    sortBy?: string;

    @ApiProperty({
        type: String,
        description: 'Sorting order asc|dsc',
        required: false,
        enum: ['asc', 'desc'],
        default: 'desc',
    })
    @IsEnum(['asc', 'desc'])
    @IsOptional()
    sort: 'asc' | 'desc';


    @ApiProperty({
        type: String,
        description: 'search eg offType, description',
        required: false,
    })
    @IsString()
    @IsOptional()
    search?: string;
}


export class OffDateListTimeSlotDto {
    @ApiProperty({
        type: String,
        example: '09:00 AM',
    })
    from: String;

    @ApiProperty({
        type: String,
        example: '12:00 PM',
    })
    to: String;

    @ApiProperty({
        type: String,
        example: '3e9e93bd-ff1f-4c89-bd12-f09bb8b7f3d3',
    })
    id: string;
}


export class OffDateListDetailsDto {
    @ApiProperty({
        type: String
    })
    @IsString()
    date: String;

    @ApiProperty({
        type: String,
        example: 'public holiday'
    })
    @IsString()
    offType: String;

    @ApiProperty({
        type: String,
        example: 'diwali holiday'
    })
    @IsString()
    description: String;

    @ApiProperty({
        type: Date,
        example: new Date().toISOString(),
    })
    createdAt: Date;

    @ApiProperty({
        type: [OffDateListTimeSlotDto],
        isArray: true
    })
    @Type(() => OffDateListTimeSlotDto)
    slots: OffDateListTimeSlotDto[];

}

export class OffDateListResultDto extends PaginateResultDto {
    @ApiProperty({
        type: [OffDateListDetailsDto],
        isArray: true,
        example: [
            {
                date: '2025-01-01',
                offType: 'public holiday',
                description: 'diwali holiday',
                createdAt: new Date().toISOString(),
                slots: [
                    {
                        from: '09:00 AM',
                        to: '12:00 PM',
                        id: '3e9e93bd-ff1f-4c89-bd12-f09bb8b7f3d3'
                    }
                ]
            }
        ]
    })
    @Type(() => OffDateListDetailsDto)
    data: OffDateListDetailsDto[];
}

export class OffDateListResponseDto extends ResponseDto {
    @ApiProperty({
        type: OffDateListResultDto
    })
    @Type(() => OffDateListResultDto)
    result: OffDateListResultDto;
}