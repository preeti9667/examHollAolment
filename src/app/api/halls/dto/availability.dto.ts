import { ResponseDto } from "@app/api/response.dto";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsString } from "class-validator";

export class HallAvailabilityQueryDto {
    @ApiProperty({
        type: String,
        example: '2024-11-21',
        required: true
    })
    @IsString()
    startDate: string;

    @ApiProperty({
        type: String,
        example: '2024-11-23',
        required: true
    })
    @IsString()
    endDate: string;

    @ApiProperty({
        type: Number,
        example: 191,
        required: true
    })
    @IsNumber()
    @Type(() => Number)
    noOfCandidates: number;
}


export class HallAvailabilitySlotDto {
    @ApiProperty({
        type: String,
        example: '9a4523db-3a4e-4435-b8e4-5dc3e28613b0',
        required: true
    })
    @IsString()
    id: string;

    @ApiProperty({
        type: String,
        example: '09:00 AM',
    })
    @IsString()
    from: string;

    @ApiProperty({
        type: String,
        example: '12:00 PM',
    })
    @IsString()
    to: string;

    @ApiProperty({
        type: Number,
        example: 191,
        required: true
    })
    @IsNumber()
    capacity: number;

    @ApiProperty({
        type: Number,
        example: 191,
        required: true
    })
    @IsNumber()
    hallCount: number;

    @ApiProperty({
        type: Boolean,
        example: true,
        required: true
    })
    @IsString()
    isAvailable: true;
}

export class HallAvailabilityDateDto {
    @ApiProperty({
        type: String,
        example: '2024-11-21',
        required: true
    })

    @IsString()
    date: string;

    @ApiProperty({
        type: HallAvailabilitySlotDto,
    })
    slots: HallAvailabilitySlotDto
}


export class HallAvailabilityResultDto {
    @ApiProperty({
        type: [HallAvailabilityDateDto],
    })
    availability: HallAvailabilityDateDto[]
}

export class HallAvailabilityResponseDto extends ResponseDto {
    @ApiProperty({
        type: HallAvailabilityResultDto
    })
    result: HallAvailabilityResultDto;
}