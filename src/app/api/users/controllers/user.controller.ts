import { Controller, Get } from "@nestjs/common";
import { UserService } from "../services";

@Controller({
    path: 'users',
    version: '1'
})
export class UserController {

    constructor(
        private $user: UserService
    ) { }

    @Get('')
    list() {
        return this.$user.list();
    }
}