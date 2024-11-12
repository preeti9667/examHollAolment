import { Module } from "@nestjs/common";
import { RoleService } from "./role.service";
import { LoggerModule } from "@app/shared/logger";

@Module({
    imports: [
        LoggerModule.register({
            context: RoleModule.name
        })
    ],
    providers: [RoleService],
    exports: [RoleService]
})
export class RoleModule { }