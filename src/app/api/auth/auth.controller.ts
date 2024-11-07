import { Body, Controller, Param, Post } from "@nestjs/common";
import { ApiHeaders, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { SendOtpPayloadDto, SendOtpResponseDto } from "./dto/send-otp.dto";
import { Message } from "@app/decorators";
import { COMMON_HEADERS } from "@app/app.constant";
import { VerifyOtpLoginPayloadDto } from "./dto/verify-otp-login.dto";

@Controller({
    path: 'auth',
    version: '1'
})
@ApiTags('Auth')
@ApiHeaders(COMMON_HEADERS)

export class AuthController {
    constructor(
        private $auth: AuthService
    ) { }


    @Post('/send-otp')
    // @UseGuards(AccessGuard)
    // @ApiBearerAuth('AccessToken')
    @Message('AUTH.OTP_SENT')
    @ApiOkResponse({ type: SendOtpResponseDto })
    @ApiOperation({ summary: 'Send Otp for login' })
    async sendOtp(@Body() payload: SendOtpPayloadDto) {
        return this.$auth.sendOtp(payload)
    }

    @Post('/verify-otp-login')
    // @UseGuards(AccessGuard)
    // @ApiBearerAuth('AccessToken')
    @Message('AUTH.OTP_VERIFIED_LOGIN')
    @ApiOkResponse({ type: SendOtpResponseDto })
    @ApiOperation({ summary: 'verify Otp for login' })
    async verifyOtp(@Body() payload: VerifyOtpLoginPayloadDto) {
        return this.$auth.verifyOtpLogin(payload)
    }
}