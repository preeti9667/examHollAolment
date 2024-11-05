import { Controller } from "@nestjs/common";

@Controller({
    path: 'admin/users',
    version: '1'
})
export class UserAdminController { }