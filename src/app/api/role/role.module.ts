import { Module } from "@nestjs/common";
import { RoleService } from "./role.service";
import { LoggerModule } from "@app/shared/logger";
import { EnvModule } from "@app/shared/env/env.module";
import { RoleController } from "./role.controller";

@Module({
    controllers: [
        RoleController
    ],
    imports: [
        LoggerModule.register({
            context: RoleModule.name
        }),
        EnvModule,
    ],
    providers: [RoleService],
    exports: [RoleService]
})
export class RoleModule { }