import { COMMON_HEADERS } from "@app/app.constant";
import { Body, Controller, Get, Patch, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiHeaders, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ApiActionNames, AppModuleNames } from "../api.constant";
import { SettingsPayloadDto, SettingsResponseDto } from "./dto/settings.dto";
import { SettingService } from "./setting.service";
import { AuthUser, Message } from "@app/decorators";
import { SetApiMetadata } from "@app/decorators/set-api-data.decorator";
import { AuthGuard } from "@app/guards/auth.guard";
import { IAuthUser } from "../auth/interfaces/auth-user";

@Controller({
    path: 'settings',
    version: '1'
})
@ApiTags('Settings')
@ApiHeaders(COMMON_HEADERS)
export class SettingController {

    constructor(
        private $setting: SettingService
    ) { }

    @Get('/')
    @UseGuards(AuthGuard)
    @SetApiMetadata(AppModuleNames.Setting, ApiActionNames.View, true)
    @ApiBearerAuth('AccessToken')
    @Message('SETTINGS.DETAILS')
    @ApiOkResponse({ type: SettingsResponseDto })
    @ApiOperation({ summary: 'Settings details by admin' })
    async details(
    ) {
        return this.$setting.get();
    }

    @Patch('/')
    @UseGuards(AuthGuard)
    @SetApiMetadata(AppModuleNames.Setting, ApiActionNames.Edit, true)
    @ApiBearerAuth('AccessToken')
    @Message('SETTINGS.UPDATED')
    @ApiOkResponse({ type: SettingsResponseDto })
    @ApiOperation({ summary: 'Settings edit by admin' })
    async edit(
        @Body() payload: SettingsPayloadDto,
        @AuthUser() user: IAuthUser
    ) {
        return this.$setting.update(payload, user.id);
    }
}