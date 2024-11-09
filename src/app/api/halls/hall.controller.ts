import { COMMON_HEADERS } from "@app/app.constant";
import { Message } from "@app/decorators";
import { AuthGuard } from "@app/gaurds/auth.guard";
import { LoggerService } from "@app/shared/logger";
import { Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiHeaders, ApiOperation, ApiTags } from "@nestjs/swagger";
import { HallService } from "./hall.service";
import { HallAvailabilityQueryDto } from "./dto/availability.dto";

@Controller({
    path: 'hall',
    version: '1'
})
@ApiHeaders(COMMON_HEADERS)
@ApiTags('Halls')

export class HallController {

    constructor(
        private $logger: LoggerService,
        private $hall: HallService
    ) { }

    @Get('/availability')
    @UseGuards(AuthGuard)
    @ApiBearerAuth('AccessToken')
    @Message('HALL.AVAILABILITY')
    // @ApiOkResponse({ type: SendOtpResponseDto })
    @ApiOperation({ summary: 'hall availability for customer' })
    async availability(
        @Query() query: HallAvailabilityQueryDto
    ) {
        const halls = await this.$hall.availability(query);
        return { halls };
    }
}