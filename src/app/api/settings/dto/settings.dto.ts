import { ResponseDto } from "@app/api/api.dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsObject } from "class-validator";

export class SettingsPayloadDto {
    @ApiProperty({
        type: Number,
        required: true,
        example: 125
    })
    pricePerSeat: number;

    @ApiProperty({
        type: Number,
        required: true,
        example: 25000
    })
    securityDeposit: number;
}


export class SettingsResultDto extends SettingsPayloadDto {
    @ApiProperty({
        type: Date,
        required: true,
        example: '2023-01-01T00:00:00.000Z'
    })
    createdAt: Date;

    @ApiProperty({
        type: Date,
        required: true,
        example: '2023-01-01T00:00:00.000Z'
    })
    updatedAt: Date;
}

export class SettingsResponseDto extends ResponseDto {
    @ApiProperty({
        type: SettingsResultDto
    })
    @IsObject()
    result: SettingsResultDto;
}
