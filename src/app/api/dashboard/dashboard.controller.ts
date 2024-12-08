import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { DashboardService } from "./dashboard.service";
import { DashboardQueryDto, DashboardResponseDto } from "./dto/dashboard.dto";
import { Message } from "@app/decorators";
import { SetApiMetadata } from "@app/decorators/set-api-data.decorator";
import { AuthGuard } from "@app/guards/auth.guard";
import { ApiBearerAuth, ApiHeaders, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AppModuleNames, ApiActionNames } from "../api.constant";
import { COMMON_HEADERS } from "@app/app.constant";

@Controller({
    path: 'dashboard',
    version: '1'
})
@ApiHeaders(COMMON_HEADERS)
@ApiTags('Dashboard')
export class DashboardController {

    constructor(
        private $dashboard: DashboardService
    ) { }

    @Get('')
    @SetApiMetadata(AppModuleNames.Dashboard, ApiActionNames.View, true)
    @UseGuards(AuthGuard)
    @ApiBearerAuth('AccessToken')
    @Message('DASHBOARD.DETAILS')
    @ApiOkResponse({ type: DashboardResponseDto })
    @ApiOperation({ summary: 'Dashboard data by admin' })
    async detailsAdmin(
        @Query() payload: DashboardQueryDto,
    ) {
        const result = await this.$dashboard.getDashboardData(payload);
        return result;
    }
}