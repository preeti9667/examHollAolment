import { ResponseDto } from "@app/api/api.dto";
import { IsBpDateFormat } from "@app/decorators/date-validator.decorator";
import { ApiProperty } from "@nestjs/swagger";
import { IsObject, IsOptional, IsString } from "class-validator";

export class DashboardQueryDto {
    @ApiProperty({
        type: String,
        required: false,
        example: '2023-01-01'
    })
    @IsOptional()
    @IsBpDateFormat()
    fromDate: string;

    @ApiProperty({
        type: String,
        required: false,
        example: '2025-01-01'
    })
    @IsOptional()
    @IsBpDateFormat()
    toDate: string;
}

export class DashboardResultDto extends DashboardQueryDto {
    @ApiProperty({
        type: Number,
        example: 1000000
    })
    totalRevenue: number;

    @ApiProperty({
        type: Number,
        example: 100000
    })
    avgBookingValue: number;

    @ApiProperty({
        type: Number,
        example: 200
    })
    bookingCompleted: number;

    @ApiProperty({
        type: Number,
        example: 20
    })
    refundPending: number;
}


export class DashboardResponseDto extends ResponseDto {
    @ApiProperty({
        type: DashboardResultDto,
    })
    @IsObject()
    result: DashboardResultDto;
}