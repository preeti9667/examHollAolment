import { COMMON_HEADERS } from "@app/app.constant";
import { Body, Controller, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiHeaders, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AdminService } from "./admin.service";
import { AuthUser, Message } from "@app/decorators";
import { IAuthAdmin } from "../auth/interfaces/auth-user";
import { AuthGuard } from "@app/guards/auth.guard";
import { MyProfileResponseDto } from "./dto/profile.dto";
import { SetApiMetadata } from "@app/decorators/set-api-data.decorator";
import { ApiActionNames, AppModuleNames } from "../api.constant";
import { CreateAdminPayloadDto, CreateAdminResponseDto } from "./dto/create.dto";
import { ListAdminQueryDto, ListAdminResponseDto } from "./dto/list.dto";
import { AdminDetailsResponseDto, AdminParamDto } from "./dto/details.dto";

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

    @Get('')
    @SetApiMetadata(AppModuleNames.Admin, ApiActionNames.View, true)
    @UseGuards(AuthGuard)
    @ApiBearerAuth('AccessToken')
    @Message('ADMIN.LIST')
    @ApiOkResponse({ type: ListAdminResponseDto })
    @ApiOperation({ summary: 'list admins' })
    async list(@Query() query: ListAdminQueryDto) {
        return this.$admin.list(query);
    }

    @Post('')
    @SetApiMetadata(AppModuleNames.Admin, ApiActionNames.Add, true)
    @UseGuards(AuthGuard)
    @ApiBearerAuth('AccessToken')
    @Message('ADMIN.CREATED')
    @ApiOkResponse({ type: CreateAdminResponseDto })
    @ApiOperation({ summary: 'Create Staff By admin' })
    async create(@Body() payload: CreateAdminPayloadDto) {
        return this.$admin.create(payload);
    }

    @Get('my-profile')
    @SetApiMetadata(AppModuleNames.Admin, ApiActionNames.View, true)
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


    @Get(':id')
    @SetApiMetadata(AppModuleNames.Admin, ApiActionNames.View, true)
    @UseGuards(AuthGuard)
    @ApiBearerAuth('AccessToken')
    @Message('ADMIN.DETAILS')
    @ApiOkResponse({ type: AdminDetailsResponseDto })
    @ApiOperation({ summary: 'fetch other admin profile details' })
    async details(
        @Param() param: AdminParamDto
    ) {
        return this.$admin.details(param);
    }
}