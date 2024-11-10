import { Controller } from "@nestjs/common";
import { SchedularService } from "./schedular.service";
import { Cron, CronExpression } from "@nestjs/schedule";
import { LoggerService } from "@app/shared/logger";

@Controller()
export class SchedularController {

    constructor(
        private $schedular: SchedularService,
        private $logger: LoggerService
    ) { }

    @Cron(CronExpression.EVERY_5_MINUTES)
    async bookingPayment() {
        // this.$logger.log("Cron start")
        this.$schedular.bookingPayment();
    }
}