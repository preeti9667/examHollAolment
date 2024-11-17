import { LoggerModule } from "@app/shared/logger";
import { Module } from "@nestjs/common";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";
import { EnvModule } from "@app/shared/env/env.module";
import { RoleModule } from "../role/role.module";

@Module({
    controllers: [AdminController],
    imports: [
        LoggerModule.register({
            context: AdminModule.name
        }),
        EnvModule,
        RoleModule
    ],
    providers: [AdminService],
    exports: [AdminService]
})
export class AdminModule { }