import { Body, Controller, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { SendOtpPayloadDto } from "./dto/send-otp.dto";

@Controller({
    path: 'auth',
    version: '1'
})
@ApiTags('Auth')

export class AuthController {
    constructor(
        private $auth: AuthService
    ) { }


    @Post('/send-otp')
    async sendOtp(@Body() payload: SendOtpPayloadDto) {
        return this.$auth.sendOtp(payload)
    }
}