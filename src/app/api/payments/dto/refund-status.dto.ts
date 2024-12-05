import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsObject, IsSemVer, IsString, IsUUID } from "class-validator";
import { PaymentRefundStatus } from "../payment.constant";
import { Extensions } from "@prisma/client/runtime/library";
import { ResponseDto } from "@app/api/api.dto";

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


export class RefundStatusResultDto {
    @ApiProperty({
        type: String,
        description: 'unique identifier of the refund',
        example: '3e9e93bd-ff1f-4c89-bd12-f09bb8b7f3d3'
    })
    @IsUUID()
    id: string;

    @ApiProperty({
        type: String,
        example: 'RF20230101001'
    })
    @IsString()
    displayId: string;

    @ApiProperty({
        type: String,
        example: PaymentRefundStatus.Approved
    })
    status: string
}


export class RefundStatusResponseDto extends ResponseDto {
    @ApiProperty({
        type: RefundStatusResultDto,
    })
    @IsObject()
    result: RefundStatusResultDto
}