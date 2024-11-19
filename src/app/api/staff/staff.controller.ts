import { COMMON_HEADERS } from "@app/app.constant";
import { Controller, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiHeaders, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { StaffService } from "./staff.service";
import { ApiActionNames, AppModuleNames } from "../api.constant";
import { Message } from "@app/decorators";
import { SetApiMetadata } from "@app/decorators/set-api-data.decorator";
import { AuthGuard } from "@app/guards/auth.guard";
import { CreateStaffPayloadDto, CreateStaffResponseDto } from "./dto/create.dto";

@Controller({
    path: "staff",
    version: "1"
})
@ApiTags("Staff")
@ApiHeaders(COMMON_HEADERS)
export class StaffController {

    constructor(private $staff: StaffService) { }

    @Post('')
    @SetApiMetadata(AppModuleNames.Staff, ApiActionNames.Add, true)
    @UseGuards(AuthGuard)
    @ApiBearerAuth('AccessToken')
    @Message('STAFF.CREATED')
    @ApiOkResponse({ type: CreateStaffResponseDto })
    @ApiOperation({ summary: 'Create Staff By admin' })
    async create(payload: CreateStaffPayloadDto) {
        return this.$staff.create(payload);
    }
}