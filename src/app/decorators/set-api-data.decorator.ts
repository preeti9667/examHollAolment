import { AppModuleNames } from "@app/api";
import { SetMetadata } from "@nestjs/common";

export const SetApiMetadata = (module: AppModuleNames, action: string, onlyAdmin?: boolean) => SetMetadata('apiMetaData', { module, action, onlyAdmin });


export interface ApiMetaData {
    module: string;
    action: string;
    onlyAdmin?: boolean
}