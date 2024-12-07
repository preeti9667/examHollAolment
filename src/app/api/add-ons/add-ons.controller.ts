import { COMMON_HEADERS } from "@app/app.constant";
import { Message } from "@app/decorators";
import { AuthGuard } from "@app/guards/auth.guard";
import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiHeaders, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AddOnsService } from "./add-ons.service";
import { CreateAddOnsDto, CreateAddOnsResponseDto } from "./dto/create.dto";
import { AddOnsListResponseDto, AddOnsListResultDto, ListAddOnsQueryDto } from "./dto/list.dto";
import { SetApiMetadata } from "@app/decorators/set-api-data.decorator";
import { AppModuleNames, ApiActionNames } from "../api.constant";
import { AddonParamDto, EditAddOnsDto } from "./dto/edit.dto";

@Controller({
    path: 'add-ons',
    version: '1'
})
@ApiHeaders(COMMON_HEADERS)
@ApiTags('Add-Ons')

export class AddOnsController {

    constructor(
        private $addOnsService: AddOnsService
    ) { }

    @Post('')
    @SetApiMetadata(AppModuleNames.Hall, ApiActionNames.Add, true)
    @UseGuards(AuthGuard)
    @ApiBearerAuth('AccessToken')
    @Message('ADD-ONS.CREATE')
    @ApiOkResponse({ type: CreateAddOnsResponseDto })
    @ApiOperation({ summary: 'Create AddOns' })
    async create(@Body() createDto: CreateAddOnsDto) {
        return await this.$addOnsService.create(
            createDto
        );
    }

    @Patch(':id')
    @SetApiMetadata(AppModuleNames.Hall, ApiActionNames.Edit, true)
    @UseGuards(AuthGuard)
    @ApiBearerAuth('AccessToken')
    @Message('ADD-ONS.UPDATED')
    @ApiOkResponse({ type: CreateAddOnsResponseDto })
    @ApiOperation({ summary: 'update add-ons by admin' })
    async edit(
        @Body() payload: EditAddOnsDto,
        @Param() params: AddonParamDto
    ) {
        return await this.$addOnsService.edit(
            payload,
            params.id
        );
    }

    @Get('/list')
    @UseGuards(AuthGuard)
    @ApiBearerAuth('AccessToken')
    @Message('ADD-ONS.LIST')
    @ApiOkResponse({ type: AddOnsListResponseDto })
    @ApiOperation({ summary: 'Add-Ons Listing For customer' })
    async listForCustomer(
    ) {
        const result = await this.$addOnsService.listForCustomer(
        );
        return result;
    }

    @Get('')
    @SetApiMetadata(AppModuleNames.Hall, ApiActionNames.Add, true)
    @UseGuards(AuthGuard)
    @ApiBearerAuth('AccessToken')
    @Message('ADD-ONS.LIST')
    @ApiOkResponse({ type: AddOnsListResponseDto })
    @ApiOperation({ summary: 'Add-Ons Listing' })
    async list(
        @Query() query: ListAddOnsQueryDto
    ) {
        const result = await this.$addOnsService.list(
            query
        );
        return AddOnsListResultDto.parse(result);
    }



}