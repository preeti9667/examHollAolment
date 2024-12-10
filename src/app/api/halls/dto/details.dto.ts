import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsString } from "class-validator";
import { Format24TO12 } from "src/utils";
import { ListHallDto } from "./list.dto";
import { Type } from "class-transformer";

export class HallDetailsSlotDto {
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
    @Format24TO12()
    @IsString()
    from: string;

    @ApiProperty({
        type: String,
        example: '12:00 PM',
    })
    @Format24TO12()
    @IsString()
    to: string;
}


export class HallDetailsResultDto extends ListHallDto {
    @ApiProperty({
        type: [HallDetailsSlotDto],
    })
    @Type(() => HallDetailsSlotDto)
    @IsArray()
    slots: HallDetailsSlotDto[]
}