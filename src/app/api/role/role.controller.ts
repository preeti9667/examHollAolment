import { COMMON_HEADERS } from "@app/app.constant";
import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiHeaders, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { RoleService } from "./role.service";
import { Message } from "@app/decorators";
import { SetApiMetadata } from "@app/decorators/set-api-data.decorator";
import { AuthGuard } from "@app/guards/auth.guard";
import { AppModuleNames, ApiActionNames } from "../api.constant";
import { RoleListResponseDto } from "./dto/list.dto";

@Controller({
    path: 'role',
    version: '1'
})
@ApiTags('Role')
@ApiHeaders(COMMON_HEADERS)
export class RoleController {

    constructor(private $role: RoleService) { }

    @Get('')
    @SetApiMetadata(AppModuleNames.Role, ApiActionNames.View, true)
    @UseGuards(AuthGuard)
    @ApiBearerAuth('AccessToken')
    @Message('ROLE.LIST')
    @ApiOkResponse({ type: RoleListResponseDto })
    @ApiOperation({ summary: 'Role list for admin' })
    async create() {
        return this.$role.list();
    }
}