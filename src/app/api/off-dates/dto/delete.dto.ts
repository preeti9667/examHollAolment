import { IsBpDateFormat } from "@app/decorators/date-validator.decorator";
import { ApiProperty } from "@nestjs/swagger";

export class OffDateRemoveQueryDto {
    @ApiProperty({
        type: String,
        example: '2024-11-21',
    })
    @IsBpDateFormat()
    date: string
}