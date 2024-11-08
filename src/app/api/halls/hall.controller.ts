import { Message } from "@app/decorators";
import { AuthGuard } from "@app/gaurds/auth.guard";
import { LoggerService } from "@app/shared/logger";
import { Controller, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";

@Controller({
    path: 'hall',
    version: '1'
})

export class HallController {

    constructor(private $logger: LoggerService) { }

    @Post('/send-otp')
    @UseGuards(AuthGuard)
    @ApiBearerAuth('AccessToken')
    @Message('HALL.AVAILABILITY')
    // @ApiOkResponse({ type: SendOtpResponseDto })
    @ApiOperation({ summary: 'hall availability ' })
    async sendOtp() {
        this.$logger.log("Called")
        return
    }
}