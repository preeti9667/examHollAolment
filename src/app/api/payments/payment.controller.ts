import { COMMON_HEADERS } from "@app/app.constant";
import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiHeaders, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { InitPaymentBodyDto, InitPaymentResponseDto } from "./dto/init-payment.dto";
import { Message, AuthUser } from "@app/decorators";
import { AuthGuard } from "@app/gaurds/auth.guard";
import { IAuthUser } from "../auth/interfaces/auth-user";

@Controller({
    path: 'payments',
    version: '1'
})
@ApiTags('Payments')
@ApiHeaders(COMMON_HEADERS)

export class PaymentController {

    @Post('/init')
    @UseGuards(AuthGuard)
    @ApiBearerAuth('AccessToken')
    @Message('PAYMENT.INITIATED')
    @ApiOkResponse({ type: InitPaymentResponseDto })
    @ApiOperation({ summary: 'Initiate booking payment' })
    async init(
        @Body() payload: InitPaymentBodyDto,
        @AuthUser() user: IAuthUser
    ) {

    }
}