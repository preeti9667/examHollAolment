import { COMMON_HEADERS } from "@app/app.constant";
import { Body, Controller, Get, Param, Post, Query, Res, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiHeaders, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { InitPaymentBodyDto, InitPaymentResponseDto } from "./dto/init-payment.dto";
import { AuthUser, Message } from "@app/decorators";
import { AuthGuard } from "@app/guards/auth.guard";
import { PaymentService } from "./payment.service";
import { Response } from "express";
import { LoggerService } from "@app/shared/logger";
import { RefundRequestPayloadDto, RefundRequestResponseDto } from "./dto/refund-request.dto";
import { IAuthUser } from "../auth/interfaces/auth-user";
import { SetApiMetadata } from "@app/decorators/set-api-data.decorator";
import { ApiActionNames, AppModuleNames } from "../api.constant";
import { LinkPaymentQueryDto } from "./dto/link-payment.dto";
import { RefundListQueryDto, RefundListResponseDto } from "./dto/refund-list.dto";

@Controller({
    path: 'payments',
    version: '1'
})
@ApiTags('Payments')
@ApiHeaders(COMMON_HEADERS)

export class PaymentController {

    constructor(
        private $payment: PaymentService,
        private $logger: LoggerService
    ) { }


    @Post('/init')
    // @UseGuards(AuthGuard)
    // @ApiBearerAuth('AccessToken')
    @Message('PAYMENT.INITIATED')
    @ApiOkResponse({ type: InitPaymentResponseDto })
    @ApiOperation({ summary: 'Initiate booking payment' })
    async init(
        @Body() payload: InitPaymentBodyDto,
    ) {
        return this.$payment.initPayment(payload)
    }

    @Post('/link')
    @SetApiMetadata(AppModuleNames.Booking, ApiActionNames.Add, true)
    @UseGuards(AuthGuard)
    @ApiBearerAuth('AccessToken')
    @Message('PAYMENT.INITIATED')
    @ApiOkResponse({ type: InitPaymentResponseDto })
    @ApiOperation({ summary: 'Initiate booking payment' })
    async link(
        @Body() payload: InitPaymentBodyDto,
    ) {
        return this.$payment.paymentLink(payload.bookingId)
    }

    @Get('/page/:bookingId')
    @Message('PAYMENT.PAGE')
    @ApiOperation({ summary: 'page for booking payment' })
    async page(
        @Param() param: LinkPaymentQueryDto,
        @Res() res: Response
    ) {
        const html = await this.$payment.page(param);
        res.send(html);
    }


    @Post('/response')
    // @UseGuards(AuthGuard)
    // @ApiBearerAuth('AccessToken')
    @Message('PAYMENT.RESPONSE')
    // @ApiOkResponse({ type: InitPaymentResponseDto })
    @ApiOperation({ summary: 'Initiate booking payment' })
    async result(
        @Body() payload: any,
        @Res() res: Response
    ) {
        try {
            const data = await this.$payment.paymentResponse(payload);
            this.$logger.log(`Encoded data : ${data.dataString}`);
            return res.redirect(302, `${data.redirectUrl}/dashboard?data=${data.dataString}`);
        } catch (error) {
            return res.redirect(302, `status=ERROR&message=${encodeURIComponent(
                "Error processing payment response"
            )}`);
        }
    }


    @Post('/refund-request')
    @UseGuards(AuthGuard)
    @ApiBearerAuth('AccessToken')
    @Message('PAYMENT.REFUND_REQUEST')
    @ApiOkResponse({ type: RefundRequestResponseDto })
    @ApiOperation({ summary: 'Refund request by customer' })
    async refundRequest(
        @Body() payload: RefundRequestPayloadDto,
        @AuthUser() user: IAuthUser
    ) {
        return this.$payment.refundRequest(payload, user.id)
    }


    @Get('refunds')
    @SetApiMetadata(AppModuleNames.Refund, ApiActionNames.View, true)
    @UseGuards(AuthGuard)
    @ApiBearerAuth('AccessToken')
    @Message('PAYMENT.REFUND_LIST')
    @ApiOkResponse({ type: RefundListResponseDto })
    @ApiOperation({ summary: 'Refund list by admin' })
    async refundList(
        @Query() payload: RefundListQueryDto
    ) {
        return this.$payment.refundList(payload)
    }
}