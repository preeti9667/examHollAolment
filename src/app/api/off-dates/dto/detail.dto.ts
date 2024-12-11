import { IsBpDateFormat } from "@app/decorators/date-validator.decorator";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { OffDateListDetailsDto } from "./list.dto";
import { Type } from "class-transformer";
import { ResponseDto } from "@app/api/api.dto";

export class OffDateParamDto {
    @ApiProperty({
        type: String,
        example: '2022-12-31'
    })
    @IsNotEmpty()
    @IsBpDateFormat()
    date: string
}


export class OffDateDetailsResultDto extends OffDateListDetailsDto {
}


export class OffDateDetailsResponseDto extends ResponseDto {
    @ApiProperty({
        type: OffDateDetailsResultDto,
        example: {
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
    })
    @Type(() => OffDateDetailsResultDto)
    data: OffDateDetailsResultDto
}