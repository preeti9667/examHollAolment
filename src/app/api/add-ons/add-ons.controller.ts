import { COMMON_HEADERS } from "@app/app.constant";
import { Message } from "@app/decorators";
import { AuthGuard } from "@app/guards/auth.guard";
import { Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiHeaders, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AddOnsService } from "./add-ons.service";
import { CreateAddOnsDto, CreateAddOnsResponseDto } from "./dto/create.dto";
import { AddOnsListResponseDto, AddOnsListResultDto, ListAddOnsQueryDto } from "./dto/list.dto";

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
    @Message('ADD-ONS.CREATE')
    @ApiOkResponse({ type: CreateAddOnsResponseDto })
    @ApiOperation({ summary: 'Create AddOns' })
    async create(@Body() createDto: CreateAddOnsDto) {
        return await this.$addOnsService.create(
            createDto
        );
    }

    @Get('')
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