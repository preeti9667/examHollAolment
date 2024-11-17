import { COMMON_HEADERS } from "@app/app.constant";
import { Controller } from "@nestjs/common";
import { ApiHeaders, ApiTags } from "@nestjs/swagger";
import { AdminService } from "./admin.service";

@Controller({
    path: 'admins',
    version: '1'
})
@ApiTags("Admin")
@ApiHeaders(COMMON_HEADERS)
export class AdminController {

    constructor(
        private $admin: AdminService
    ) {

    }
}