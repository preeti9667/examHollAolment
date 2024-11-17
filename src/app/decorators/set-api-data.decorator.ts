import { SetMetadata } from "@nestjs/common";

export const SetApiMetadata = (apiMetaData: ApiMetaData) => SetMetadata('apiMetaData', apiMetaData);


export interface ApiMetaData {
    module: string;
    action: string;
    onlyAdmin?: boolean
}