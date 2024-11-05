import { Controller, Get } from "@nestjs/common";

@Controller({
})
export class ApiController {

    @Get()
    get() {
        return 'Working fine!'
    }
}