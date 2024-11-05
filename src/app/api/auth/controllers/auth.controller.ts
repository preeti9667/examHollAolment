import { Controller } from "@nestjs/common";
import { AuthService } from "../services";

@Controller({
    path: 'auth',
    version: '1'
})

export class AuthController {
    constructor(
        private $auth: AuthService
    ) { }
}