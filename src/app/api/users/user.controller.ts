import { Body, Controller, Get, Patch, Query, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { UpdateProfilePayloadDto, UpdateProfileResponseDto } from "./dto/update-profile.dto";
import { AuthUser, Message } from "@app/decorators";
import { AuthGuard } from "@app/guards/auth.guard";
import { ApiBearerAuth, ApiHeaders, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { IAuthUser } from "../auth/interfaces/auth-user";
import { COMMON_HEADERS } from "@app/app.constant";
import { ProfileDetailsResponseDto } from "./dto/profile.dto";
import { UserListQueryDto, UserListResponseDto } from "./dto/list.dto";
import { SetApiMetadata } from "@app/decorators/set-api-data.decorator";
import { AppModuleNames, ApiActionNames } from "../api.constant";

@Controller({
    path: 'users',
    version: '1'
})
@ApiTags('Users')
@ApiHeaders(COMMON_HEADERS)
export class UserController {

    constructor(
        private $user: UserService
    ) { }


    @Get('')
    @SetApiMetadata(AppModuleNames.User, ApiActionNames.View, true)
    @UseGuards(AuthGuard)
    @ApiBearerAuth('AccessToken')
    @Message('USER.LIST')
    @ApiOkResponse({ type: UserListResponseDto })
    @ApiOperation({ summary: 'User list by admin' })
    async list(@Query() query: UserListQueryDto) {
        return this.$user.list(query);
    }

    @Patch('')
    @UseGuards(AuthGuard)
    @ApiBearerAuth('AccessToken')
    @Message('USER.UPDATED')
    @ApiOkResponse({ type: UpdateProfileResponseDto })
    @ApiOperation({ summary: 'Update profile by customer' })
    async updateProfile(
        @Body() payload: UpdateProfilePayloadDto,
        @AuthUser() user: IAuthUser
    ) {
        return this.$user.updateProfile(payload, user.id);
    }

    @Get('profile')
    @UseGuards(AuthGuard)
    @ApiBearerAuth('AccessToken')
    @Message('USER.DETAILS')
    @ApiOkResponse({ type: ProfileDetailsResponseDto })
    @ApiOperation({ summary: 'Profile details by customer' })
    async details(
        @AuthUser() user: IAuthUser
    ) {
        return this.$user.details(user.id);
    }
}