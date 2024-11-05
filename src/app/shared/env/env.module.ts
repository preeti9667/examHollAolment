import { Module } from "@nestjs/common";
import { EnvService } from ".";
import { ConfigModule } from "@nestjs/config";
import { plainToInstance } from "class-transformer";
import { EnvConfig } from "src/config";
import { validateSync } from "class-validator";
import { error } from "console";


@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validate(config: Record<string, unknown>) {
                let envs: any = {};
                Object.keys(config).forEach((key: string) => {
                    const [root, nested] = key.split('.');
                    if (nested) {
                        if (envs[root]) {
                            envs[root][nested] = config[key]
                        }
                        else {
                            envs[root] = { [nested]: config[key] }
                        }

                    }
                    else {
                        envs[root] = config[key];
                    }
                });

                const validatedConfig = plainToInstance(EnvConfig, envs, { enableImplicitConversion: true });
                const errors = validateSync(validatedConfig, {
                    skipMissingProperties: false,
                });

                if (errors.length > 0) {
                    throw new Error(errors.toString());
                }
                return validatedConfig;
            },
        })
    ],
    providers: [
        EnvService
    ],
    exports: [
        EnvService
    ]

})

export class EnvModule { }