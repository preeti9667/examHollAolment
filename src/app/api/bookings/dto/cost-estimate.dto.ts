import { ApiProperty } from "@nestjs/swagger";
import { BookingDateTimeSlotDto } from "./create.dto";
import { Type } from "class-transformer";
import { ResponseDto } from "@app/api/response.dto";
import { IsObject } from "class-validator";

export class CostEstimatePayloadDto {
    @ApiProperty({
        type: [BookingDateTimeSlotDto],
        description: "Array of time slots with date and no of candidates"
    })
    @Type(() => BookingDateTimeSlotDto)
    timeSlots: BookingDateTimeSlotDto[]
}


export class CostEstimateResultDto {
    @ApiProperty({
        type: Number,
        example: 800000,
        description: "Estimated cost "
    })
    totalCost: number;

    @ApiProperty({
        type: Number,
        example: 4,
        description: "Total no of halls"
    })
    totalHalls: number;

    @ApiProperty({
        type: Number,
        example: 1000,
        description: "no of candidates"
    })
    noOfCandidates: number;
}

export class CostEstimateResponseDto extends ResponseDto {
    @ApiProperty({
        type: CostEstimateResultDto
    })
    @IsObject()
    result: CostEstimateResultDto;
}