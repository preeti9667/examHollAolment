import { COMMON_HEADERS } from "@app/app.constant";
import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiHeaders, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AdminService } from "./admin.service";
import { AuthUser, Message } from "@app/decorators";
import { IAuthAdmin } from "../auth/interfaces/auth-user";
import { AuthGuard } from "@app/gaurds/auth.guard";
import { MyProfileResponseDto } from "./dto/profile.dto";
import { SetApiMetadata } from "@app/decorators/set-api-data.decorator";
import { AppModuleNames } from "../api.constant";

@Controller({
    path: 'admins',
    version: '1'
})
@ApiTags("Admin")
@ApiHeaders(COMMON_HEADERS)
export class AdminController {

    constructor(
        private $admin: AdminService
    ) {

    }

    @Get('my-profile')
    @SetApiMetadata(AppModuleNames.Staff, 'VIEW', true)
    @UseGuards(AuthGuard)
    @ApiBearerAuth('AccessToken')
    @Message('ADMIN.PROFILE')
    @ApiOkResponse({ type: MyProfileResponseDto })
    @ApiOperation({ summary: 'fetch own admin profile details' })
    async profile(
        @AuthUser() user: IAuthAdmin
    ) {
        return this.$admin.profile(user);
    }
}