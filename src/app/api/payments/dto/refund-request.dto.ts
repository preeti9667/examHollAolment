import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString, IsUUID } from "class-validator";
import { PaymentRefundMethod } from "../payment.constant";
import { Type } from "class-transformer";
import { ResponseDto } from "@app/api/api.dto";


export class PaymentRefundBankDetailsDto {
    @ApiProperty({
        type: String,
        example: '20231949708'
    })
    @IsString()
    accountNumber: string;

    @ApiProperty({
        type: String,
        example: 'State bank India'
    })
    @IsString()
    name: string;

    @ApiProperty({
        type: String,
        example: 'State bank India'
    })
    @IsString()
    ifscCode: string;
}
export class RefundRequestPayloadDto {
    @ApiProperty({
        type: String,
        example: '3e9e93bd-ff1f-4c89-bd12-f09bb8b7f3d3',
        description: 'booking id'
    })
    @IsUUID()
    bookingId: string;

    @ApiProperty({
        type: String,
        enum: PaymentRefundMethod,
        example: PaymentRefundMethod.Upi,
        description: 'refund method'
    })
    @IsString()
    @IsEnum(PaymentRefundMethod)
    refundMethod: PaymentRefundMethod;


    @ApiProperty({
        type: String,
        example: 'upi',
        description: 'upi id'
    })
    @IsString()
    upiId: string;


    @ApiProperty({
        type: PaymentRefundBankDetailsDto,
    })
    @IsOptional()
    @Type(() => PaymentRefundBankDetailsDto)
    bankDetails: PaymentRefundBankDetailsDto;

}



export class RefundRequestResultDto {
    @ApiProperty({
        type: String,
        example: '3e9e93bd-ff1f-4c89-bd12-f09bb8b7f3d3',
    })
    @IsUUID()
    id: string


    @ApiProperty({
        type: String,
        example: 'RFD-123XYZAABB'
    })
    @IsString()
    displayId: string;
}


export class RefundRequestResponseDto extends ResponseDto {
    @ApiProperty({
        type: RefundRequestResultDto,
    })
    result: RefundRequestResultDto
}
