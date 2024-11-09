import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

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
    @IsString()
    noOfCandidates: number;
}