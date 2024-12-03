import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsNumber, Min, Max, IsEnum, IsBoolean, IsString } from "class-validator";
import { Transform } from "stream";
import { PaymentRefundMethod, PaymentRefundStatus } from "../payment.constant";
import { PaginateResultDto } from "@app/api/api.dto";

export class RefundListQueryDto {
    @ApiProperty({
        type: Number,
        description: 'Page number',
        required: false,
        default: 1,
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    page: number;

    @ApiProperty({
        type: Number,
        description: 'Records per page',
        required: false,
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Max(100)
    limit: number;

    @ApiProperty({
        required: false,
        enum: ['createdAt'],
        default: 'createdAt',
    })
    @IsOptional()
    @IsEnum(['createdAt'])
    sortBy?: string;

    @ApiProperty({
        type: String,
        description: 'Sorting order asc|dsc',
        required: false,
        enum: ['asc', 'desc'],
        default: 'desc',
    })
    @IsEnum(['asc', 'desc'])
    @IsOptional()
    sort: 'asc' | 'desc';


    @ApiProperty({
        type: String,
        description: 'refund id',
        required: false,
    })
    @IsString()
    @IsOptional()
    search?: string;
}
export class RefundListBookingDetailsDto {
    @ApiProperty({
        description: 'Unique identifier for the booking',
        example: '10c93905-eaeb-4195-8d6f-38005ab2db95'
    })
    id: string;

    @ApiProperty({
        description: 'Display ID for the booking',
        example: 'BK202412010004'
    })
    displayId: string;

    @ApiProperty({
        description: 'Name of the exam for the booking',
        example: 'The Selection Exam'
    })
    examName: string;
}

export class RefundListBankDetailsDto {
    @ApiProperty({
        description: 'Account number for the bank',
        example: '20231949708'
    })
    accountNumber: string;

    @ApiProperty({
        description: 'Name of the bank',
        example: 'State bank India'
    })
    name: string;

    @ApiProperty({
        description: 'IFSC code for the bank',
        example: 'State bank India'
    })
    ifscCode: string;
}
export class RefundListDetailsDto {
    @ApiProperty({
        description: 'Unique identifier for the payment',
        example: 'dd34b891-828e-4221-8195-8b654d76e974',
    })
    id: string;

    @ApiProperty({
        description: 'Display ID for the payment',
        example: 'RF202401010001'
    })
    displayId: string;

    @ApiProperty({
        description: 'Status of the payment',
        enum: PaymentRefundStatus,
        example: PaymentRefundStatus.Requested
    })
    status: string;

    @ApiProperty({
        description: 'Payment method used',
        enum: PaymentRefundMethod,
        example: PaymentRefundMethod.Upi
    })
    paymentMethod: PaymentRefundMethod;

    @ApiProperty({
        description: 'UPI ID for the payment',
        example: 'test@upi'
    })
    upiId: string;

    @ApiProperty({
        description: 'Bank details for the payment'
    })
    bankDetails: RefundListBankDetailsDto;

    @ApiProperty({
        description: 'Amount of the payment',
        example: 25000
    })
    amount: number;

    @ApiProperty({
        description: 'Timestamp when the payment was created',
        example: '2024-11-29T04:03:05.881Z'
    })
    createdAt: Date;

    @ApiProperty({
        description: 'Timestamp when the payment was last updated',
        example: '2024-11-29T04:03:05.881Z'
    })
    updatedAt: Date;

    @ApiProperty({
        description: 'Booking details associated with the payment'
    })
    booking: RefundListBookingDetailsDto;
}

export class RefundListResultDto extends PaginateResultDto {
    @ApiProperty({
        type: [RefundListDetailsDto],
        isArray: true
    })
    data: RefundListDetailsDto[]
}

export class RefundListResponseDto {
    @ApiProperty({
        type: RefundListResultDto
    })
    data: RefundListResultDto;
}



