import { LoggerModule } from "@app/shared/logger";
import { Module } from "@nestjs/common";
import { AddOnsController } from "./add-ons.controller";
import { AddOnsService } from "./add-ons.service";

@Module({
    imports: [
        LoggerModule.register({ context: AddOnsModule.name }),
    ],
    controllers: [
        AddOnsController
    ],
    providers: [
        AddOnsService
    ]
})
export class AddOnsModule { }