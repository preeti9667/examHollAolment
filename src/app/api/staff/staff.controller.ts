import { COMMON_HEADERS } from "@app/app.constant";
import { Controller } from "@nestjs/common";
import { ApiHeaders, ApiTags } from "@nestjs/swagger";

@Controller({
    path: "staff",
    version: "1"
})
@ApiTags("Staff")
@ApiHeaders(COMMON_HEADERS)
export class StaffController { }