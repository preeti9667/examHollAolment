import { COMMON_HEADERS } from "@app/app.constant";
import { Message } from "@app/decorators";
import { AuthGuard } from "@app/gaurds/auth.guard";
import { LoggerService } from "@app/shared/logger";
import { Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiHeaders, ApiOperation, ApiTags } from "@nestjs/swagger";

@Controller({
    path: 'hall',
    version: '1'
})
@ApiHeaders(COMMON_HEADERS)
@ApiTags('Halls')

export class HallController {

    constructor(private $logger: LoggerService) { }

    @Get('/availability')
    @UseGuards(AuthGuard)
    @ApiBearerAuth('AccessToken')
    @Message('HALL.AVAILABILITY')
    // @ApiOkResponse({ type: SendOtpResponseDto })
    @ApiOperation({ summary: 'hall availability for customer' })
    async availability() {
        this.$logger.log("Called")
        return
    }
}