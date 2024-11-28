import { IsBpDateFormat } from "@app/decorators/date-validator.decorator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsOptional, IsString, IsUUID } from "class-validator";

export class AddUpdateOffDateDto {
    @ApiProperty({
        type: String,
        example: '2024-12-25'
    })
    @IsBpDateFormat()
    date: string;

    @ApiProperty({
        type: [String],
        description: 'array of time slots ids',
        example: ['1b53c972-bdc7-4cfb-bf86-90a55e8b95ae']
    })
    @IsArray()
    @IsUUID()
    slots: string[];

    @ApiProperty({
        type: String,
        example: "Public holiday"
    })
    @IsString()
    offType: string;

    @ApiProperty({
        type: String,
        example: "Today is gandhi jayanti",
    })
    @IsOptional()
    @IsString()
    description: string;
}

export class AddUpdateOffDatePayloadDto {
    @ApiProperty({
        type: [AddUpdateOffDateDto],
    })
    @Type(() => AddUpdateOffDateDto)
    dates: AddUpdateOffDateDto[]
}