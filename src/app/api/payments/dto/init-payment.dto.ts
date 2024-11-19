import { ResponseDto } from "@app/api/api.dto";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsObject, IsString, IsUUID } from "class-validator";

export class InitPaymentBodyDto {
    @ApiProperty({
        type: String,
        example: '3e9e93bd-ff1f-4c89-bd12-f09bb8b7f3d3',
        required: true
    })
    @IsUUID()
    bookingId: string;
}

export class InitPaymentTransactionDto {
    @ApiProperty({
        type: String,
        required: true
    })
    @IsString()
    spURL: string;

    @ApiProperty({
        type: String,
        required: true
    })
    @IsString()
    encData: string;

    @ApiProperty({
        type: String,
        required: true
    })
    @IsString()
    clientCode: string;
}

export class InitPaymentResultDto {
    @ApiProperty({
        type: String,
        example: '3e9e93bd-ff1f-4c89-bd12-f09bb8b7f3d3',
        required: true
    })
    @IsUUID()
    id: string;

    @ApiProperty({
        type: String,
        example: '3e9e93bd-ff1f-4c89-bd12-f09bb8b7f3d3',
        required: true
    })
    @IsUUID()
    bookingId: string;

    @ApiProperty({
        type: String,
        required: true
    })
    @IsString()
    transactionId: string;


    @ApiProperty({
        type: InitPaymentTransactionDto,
    })
    @IsObject()
    transaction: InitPaymentTransactionDto
}


export class InitPaymentResponseDto extends ResponseDto {
    @ApiProperty({
        type: InitPaymentTransactionDto
    })
    @Type(() => InitPaymentTransactionDto)
    result: InitPaymentTransactionDto;
}