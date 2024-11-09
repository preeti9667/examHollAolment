import { COMMON_HEADERS } from "@app/app.constant";
import { Message } from "@app/decorators";
import { AuthGuard } from "@app/gaurds/auth.guard";
import { LoggerService } from "@app/shared/logger";
import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiHeaders, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { HallService } from "./hall.service";
import { CreateHallDto, CreateHallResponseDto } from "./dto/create.dto";

@Controller({
  path: 'hall',
  version: '1'
})
@ApiHeaders(COMMON_HEADERS)
@ApiTags('Halls')

export class HallController {

  constructor(
    private $logger: LoggerService,
    private readonly $hallService: HallService
  ) { }

  @Get('/availability')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('AccessToken')
  @Message('HALL.AVAILABILITY')
  // @ApiOkResponse({ type: SendOtpResponseDto })
  @ApiOperation({ summary: 'hall availability for customer' })
  async availability() {
    this.$logger.log("Called")
    return
  }

  @Post('')
  @Message('HALL.CREATE')
  @ApiOkResponse({ type: CreateHallResponseDto })
  @ApiOperation({ summary: 'Create hall' })
  async create(@Body() createDto: CreateHallDto) {
    return await this.$hallService.create(
      createDto
    );
  }

}