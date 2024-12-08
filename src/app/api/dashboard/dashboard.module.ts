import { Module } from "@nestjs/common";
import { DashboardController } from "./dashboard.controller";
import { LoggerModule } from "@app/shared/logger";
import { DashboardService } from "./dashboard.service";

@Module({
    controllers: [DashboardController],
    imports: [
        LoggerModule.register({
            context: DashboardModule.name
        })
    ],
    providers: [DashboardService]
})
export class DashboardModule { }