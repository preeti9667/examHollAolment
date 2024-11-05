import { Body, Controller, Param, Post } from "@nestjs/common";
import { AuthService } from "../services";
import { SendOtpPayloadDto } from "../dto/send-otp.dto";
import { ApiTags } from "@nestjs/swagger";

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