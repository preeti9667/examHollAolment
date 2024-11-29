import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsObject, IsUUID, IsString, IsEnum, IsNumber } from "class-validator";
import { PaymentRefundMethod, PaymentRefundStatus, PaymentRefundType } from "../payment.constant";
import { PaymentRefundBankDetailsDto } from "./refund-request.dto";

export class RefundDetailsDto {
    @ApiProperty({
        type: PaymentRefundBankDetailsDto
    })
    @IsOptional()
    @IsObject()
    @Type(() => PaymentRefundBankDetailsDto)
    bankDetails: PaymentRefundBankDetailsDto;

    @ApiProperty({
        type: String,
        example: '3e9e93bd-ff1f-4c89-bd12-f09bb8b7f3d3',
    })
    @IsUUID()
    id: string;

    @ApiProperty({
        type: String,
        example: 'ADFGHJ234',
    })
    @IsString()
    displayId: string;

    @ApiProperty({
        type: String,
        example: 'test@upi',
    })
    @IsString()
    upiId: string;

    @ApiProperty({
        type: String,
        example: 'UPI',
    })
    @IsEnum(PaymentRefundMethod)
    paymentMethod: string;

    @ApiProperty({
        type: Number,
        example: 100,
    })
    @IsNumber()
    amount: number;

    @ApiProperty({
        type: PaymentRefundType,
        example: PaymentRefundType.SecurityDeposit,
    })
    @IsString()
    refundType: PaymentRefundType;

    @ApiProperty({
        type: PaymentRefundStatus,
        example: PaymentRefundStatus.Requested
    })
    @IsString()
    status: PaymentRefundStatus;


}