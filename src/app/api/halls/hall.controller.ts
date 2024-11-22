import { COMMON_HEADERS } from "@app/app.constant";
import { Message } from "@app/decorators";
import { AuthGuard } from "@app/guards/auth.guard";
import { LoggerService } from "@app/shared/logger";
import { HallAvailabilityQueryDto, HallAvailabilityResponseDto } from "./dto/availability.dto";
import { Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiHeaders, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { HallService } from "./hall.service";
import { CreateHallDto, CreateHallResponseDto } from "./dto/create.dto";
import { HallListResponseDto, HallListResultDto, ListHallDto, ListHallQueryDto } from "./dto/list.dto";
import { SetApiMetadata } from "@app/decorators/set-api-data.decorator";
import { ApiActionNames, AppModuleNames } from "../api.constant";

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
    @ApiOkResponse({ type: HallAvailabilityResponseDto })
    @ApiOperation({ summary: 'hall availability for customer' })
    async availability(
        @Query() query: HallAvailabilityQueryDto
    ) {
        const availability = await this.$hall.availability(query);
        return { availability };
    }



    @Post('')
    @SetApiMetadata(AppModuleNames.Hall, ApiActionNames.Add, true)
    @UseGuards(AuthGuard)
    @ApiBearerAuth('AccessToken')
    @Message('HALL.CREATE')
    @ApiOkResponse({ type: CreateHallResponseDto })
    @ApiOperation({ summary: 'Create Hall by admin' })
    async create(@Body() createDto: CreateHallDto) {
        return await this.$hall.create(
            createDto
        );
    }


    @Get('')
    @SetApiMetadata(AppModuleNames.Hall, ApiActionNames.View, true)
    @UseGuards(AuthGuard)
    @ApiBearerAuth('AccessToken')
    @Message('HALL.LIST')
    @ApiOkResponse({ type: HallListResponseDto })
    @ApiOperation({ summary: 'Hall Listing By admin' })
    async list(
        @Query() query: ListHallQueryDto
    ) {
        const result = await this.$hall.list(
            query
        );
        return HallListResultDto.parse(result);
    }
}