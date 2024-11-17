import { Module } from "@nestjs/common";
import { StaffController } from "./staff.controller";
import { StaffService } from "./staff.service";
import { LoggerModule } from "@app/shared/logger";

@Module({
    imports: [
        LoggerModule.register(
            {
                context: StaffModule.name
            }
        )
    ],
    controllers: [StaffController],
    providers: [StaffService],
})
export class StaffModule { }