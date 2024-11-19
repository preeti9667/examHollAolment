import { COMMON_HEADERS } from "@app/app.constant";
import { Controller } from "@nestjs/common";
import { ApiHeaders, ApiTags } from "@nestjs/swagger";

@Controller({
    path: 'off-dates',
    version: '1'
})
@ApiTags('Off Date')
@ApiHeaders(COMMON_HEADERS)
export class OffDateController { }