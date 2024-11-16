import { COMMON_HEADERS } from "@app/app.constant";
import { Body, Controller, Post, Res, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiHeaders, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { InitPaymentBodyDto, InitPaymentResponseDto } from "./dto/init-payment.dto";
import { Message } from "@app/decorators";
import { AuthGuard } from "@app/gaurds/auth.guard";
import { PaymentService } from "./payment.service";
import { Response } from "express";

@Controller({
    path: 'payments',
    version: '1'
})
@ApiTags('Payments')
@ApiHeaders(COMMON_HEADERS)

export class PaymentController {

    constructor(
        private $payment: PaymentService
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


    @Post('/response')
    // @UseGuards(AuthGuard)
    // @ApiBearerAuth('AccessToken')
    @Message('PAYMENT.RESPONSE')
    @ApiOkResponse({ type: InitPaymentResponseDto })
    @ApiOperation({ summary: 'Initiate booking payment' })
    async result(
        @Body() payload: any,
        @Res() res: Response
    ) {
        const data = this.$payment.paymentResponse(payload);
        return res.redirect(302, `/dashboard?data=${data}`);
    }
}