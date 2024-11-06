import { ApiProperty } from "@nestjs/swagger";

export class ResponseDto {
    @ApiProperty({
        type: Number,
        example: 200
    })
    status: number;

    @ApiProperty({
        type: String,
        example: "Success"
    })
    message: number;

    @ApiProperty({
        type: Object,
    })
    result: any;
}