import { Controller } from "@nestjs/common";
import { SchedularService } from "./schedular.service";

@Controller()
export class SchedularController {

    constructor(
        private $schedule: SchedularService
    ) {



    }
}