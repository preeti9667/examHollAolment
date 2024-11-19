import { COMMON_HEADERS } from "@app/app.constant";
import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiHeaders, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ResponseDto } from "../api.dto";
import { Message } from "@app/decorators";
import { SetApiMetadata } from "@app/decorators/set-api-data.decorator";
import { AuthGuard } from "@app/guards/auth.guard";
import { AppModuleNames, ApiActionNames } from "../api.constant";
import { AddUpdateOffDatePayloadDto } from "./dto/add-update.dto";
import { OffDateService } from "./off-date.service";

@Controller({
    path: 'off-dates',
    version: '1'
})
@ApiTags('Off Date')
@ApiHeaders(COMMON_HEADERS)
export class OffDateController {

    constructor(
        private $offDate: OffDateService
    ) { }

    @Post()
    @SetApiMetadata(AppModuleNames.OffDate, ApiActionNames.Add, true)
    @UseGuards(AuthGuard)
    @ApiBearerAuth('AccessToken')
    @Message('OFF_DATE.CREATED')
    @ApiOkResponse({ type: ResponseDto })
    @ApiOperation({ summary: 'add off dates  admin' })
    create(
        @Body() payload: AddUpdateOffDatePayloadDto
    ) {
        return this.$offDate.addUpdate(payload);
    }
}