import { ApiProperty } from "@nestjs/swagger";
import { RefundListDetailsDto } from "./refund-list.dto";
import { ResponseDto } from "@app/api/api.dto";

export class RefundDetailsDto extends RefundListDetailsDto {
    @ApiProperty({
        type: String,
        example: 'comment'
    })
    comment: string;

    @ApiProperty({
        type: Object,
        example: {
            id: '3e9e93bd-ff1f-4c89-bd12-f09bb8b7f3d3',
            name: 'admin',
            displayId: 'ADFGHJ234'
        }
    })
    statusBy: string;

    @ApiProperty({
        type: Date,
        example: '2023-10-10T00:00:00.000Z'
    })
    statusAt: Date;
}


export class RefundDetailsResponseDto extends ResponseDto {
    @ApiProperty({
        type: RefundDetailsDto
    })
    result: RefundDetailsDto;
}