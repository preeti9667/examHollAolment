import { DynamicModule, Module } from "@nestjs/common";
import { LoggerService } from ".";
import { RegisterOptions } from "./logger";
import { CONTEXT_CONFIG, OUTPUT_CONFIG } from "./logger.constant";

@Module({
    imports: [],
    exports: [LoggerService],
    providers: [LoggerService]
})
export class LoggerModule {
    static register(options: RegisterOptions): DynamicModule {
        return {
            module: LoggerModule,
            providers: [
                { provide: CONTEXT_CONFIG, useValue: options.context },
                { provide: OUTPUT_CONFIG, useValue: options.output },
            ],
        };
    }
}