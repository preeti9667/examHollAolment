import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsSemVer, IsString, IsUUID } from "class-validator";
import { PaymentRefundStatus } from "../payment.constant";

export class RefundParamDto {
    @ApiProperty({
        type: String,
        description: 'unique identifier of the refund',
        example: '3e9e93bd-ff1f-4c89-bd12-f09bb8b7f3d3'
    })
    @IsUUID()
    id: string;
}
export class RefundStatusPayloadDto {
    @ApiProperty({
        type: String,
        description: 'unique identifier of the refund',
        example: '3e9e93bd-ff1f-4c89-bd12-f09bb8b7f3d3'
    })
    @IsUUID()
    refundId: string;

    @ApiProperty({
        type: String,
        description: 'status of the refund',
        enum: [PaymentRefundStatus.Approved, PaymentRefundStatus.Rejected],
    })
    @IsEnum([PaymentRefundStatus.Approved, PaymentRefundStatus.Rejected])
    status: PaymentRefundStatus;


    @ApiProperty({
        type: String,
        description: 'comment for the refund',
        example: 'test reason'
    })
    @IsString()
    comment: string
}