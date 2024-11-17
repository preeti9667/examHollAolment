import { LoggerModule } from "@app/shared/logger";
import { Module } from "@nestjs/common";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";

@Module({
    controllers: [AdminController],
    imports: [
        LoggerModule.register({
            context: AdminModule.name
        })
    ],
    providers: [AdminService],
    exports: [AdminService]
})
export class AdminModule { }