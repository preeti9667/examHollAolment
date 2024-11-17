import { Module } from "@nestjs/common";
import { SubPaisaController } from "./subpaisa.controller";
import { LoggerModule } from "@app/shared/logger";
import { SubPaisaService } from "./subpaisa.service";
import { EnvModule } from "@app/shared/env/env.module";

@Module({
    controllers: [SubPaisaController],
    imports: [
        EnvModule,
        LoggerModule.register({ context: SubPaisaModule.name })],
    providers: [SubPaisaService],
    exports: [SubPaisaService]
})
export class SubPaisaModule { }