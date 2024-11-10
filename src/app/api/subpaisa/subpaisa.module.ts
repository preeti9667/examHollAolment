import { Module } from "@nestjs/common";
import { SubPaisaController } from "./subpaisa.controller";
import { LoggerModule } from "@app/shared/logger";
import { SubPaisaService } from "./subpaisa.service";

@Module({
    controllers: [SubPaisaController],
    imports: [LoggerModule.register({ context: SubPaisaModule.name })],
    providers: [SubPaisaService],
    exports: [SubPaisaService]
})
export class SubPaisaModule { }