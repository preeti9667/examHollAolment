import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
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
import { identity } from "rxjs";
import { CreateUserPayloadDto, CreateUserResponseDto } from "./dto/create.dto";
import { CreateUserVerifyOtpDto, CreateUserVerifyOtpResponseDto } from "./dto/verify-otp.dto";
import { ResponseDto } from "../api.dto";
import { StatusPayloadDto, StatusResponseDto } from "./dto/status.dto";

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

    @Post('otp')
    @SetApiMetadata(AppModuleNames.User, ApiActionNames.Add, true)
    @UseGuards(AuthGuard)
    @ApiBearerAuth('AccessToken')
    @Message('USER.OTP_SENT')
    @ApiOkResponse({ type: CreateUserResponseDto })
    @ApiOperation({ summary: 'create user by admin and get request id, sent otp to user number' })
    async create(
        @Body() payload: CreateUserPayloadDto,
    ) {
        return this.$user.create(payload);
    }

    @Post('create')
    @SetApiMetadata(AppModuleNames.User, ApiActionNames.Add, true)
    @UseGuards(AuthGuard)
    @ApiBearerAuth('AccessToken')
    @Message('USER.CREATED')
    @ApiOkResponse({ type: CreateUserVerifyOtpResponseDto })
    @ApiOperation({ summary: 'verify otp and create user by admin' })
    async createVerifyOtp(
        @Body() payload: CreateUserVerifyOtpDto,
        @AuthUser() user: IAuthUser
    ) {
        return this.$user.createdUserVerifyOtp(payload, user.id);
    }

    @Patch(':id')
    @SetApiMetadata(AppModuleNames.User, ApiActionNames.Status, true)
    @UseGuards(AuthGuard)
    @ApiBearerAuth('AccessToken')
    @Message((req) => {
        if (req.body.status === true) return 'USER.ACTIVATED';
        return 'USER.DEACTIVATED';
    })
    @ApiOkResponse({ type: StatusResponseDto })
    @ApiOperation({ summary: 'Update user status by admin' })
    async status(
        @Body() payload: StatusPayloadDto,
        @AuthUser() admin: IAuthUser,
        @Param('id') userId: string
    ) {
        return this.$user.status(userId, payload, admin.id);
    }


    @Get('/:id')
    @UseGuards(AuthGuard)
    @SetApiMetadata(AppModuleNames.User, ApiActionNames.View, true)
    @ApiBearerAuth('AccessToken')
    @Message('USER.DETAILS')
    @ApiOkResponse({ type: ProfileDetailsResponseDto })
    @ApiOperation({ summary: 'User Profile details by admin' })
    async detailsByAdmin(
        @Param('id') userId: string
    ) {
        return this.$user.details(userId);
    }
}