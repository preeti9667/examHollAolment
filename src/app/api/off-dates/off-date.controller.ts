import { COMMON_HEADERS } from "@app/app.constant";
import { Body, Controller, Delete, Get, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiHeaders, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ResponseDto } from "../api.dto";
import { Message } from "@app/decorators";
import { SetApiMetadata } from "@app/decorators/set-api-data.decorator";
import { AuthGuard } from "@app/guards/auth.guard";
import { AppModuleNames, ApiActionNames } from "../api.constant";
import { AddUpdateOffDatePayloadDto } from "./dto/add-update.dto";
import { OffDateService } from "./off-date.service";
import { OffDateListQueryDto, OffDateListResponseDto } from "./dto/list.dto";
import { OffDateRemoveQueryDto } from "./dto/delete.dto";

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

    @Get()
    @SetApiMetadata(AppModuleNames.OffDate, ApiActionNames.View, true)
    @UseGuards(AuthGuard)
    @ApiBearerAuth('AccessToken')
    @Message('OFF_DATE.LIST')
    @ApiOkResponse({ type: OffDateListResponseDto })
    @ApiOperation({ summary: 'off dates list for  admin' })
    async list(
        @Query() payload: OffDateListQueryDto
    ) {
        return this.$offDate.list(payload);
    }

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

    @Delete()
    @SetApiMetadata(AppModuleNames.OffDate, ApiActionNames.Delete, true)
    @UseGuards(AuthGuard)
    @ApiBearerAuth('AccessToken')
    @Message('OFF_DATE.REMOVE')
    @ApiOkResponse({ type: ResponseDto })
    @ApiOperation({ summary: 'off dates remove by  admin' })
    async remove(
        @Query() payload: OffDateRemoveQueryDto
    ) {
        return this.$offDate.remove(payload);
    }


}