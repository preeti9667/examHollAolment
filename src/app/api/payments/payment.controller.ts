import { COMMON_HEADERS } from "@app/app.constant";
import { Body, Controller, Get, Param, Post, Res, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiHeaders, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { InitPaymentBodyDto, InitPaymentResponseDto } from "./dto/init-payment.dto";
import { Message } from "@app/decorators";
import { AuthGuard } from "@app/gaurds/auth.guard";
import { PaymentService } from "./payment.service";
import { Response } from "express";
import { LoggerService } from "@app/shared/logger";

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

    @Get('/page/:bookingId')
    @Message('PAYMENT.PAGE')
    @ApiOperation({ summary: 'page for booking payment' })
    async page(
        @Param() param: InitPaymentBodyDto,
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
}