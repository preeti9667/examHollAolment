import { ApiHeaderOptions } from "@nestjs/swagger";

export const SWAGGER_CONFIG = {
    TITLE: 'Api',
    DESCRIPTION: 'This is api description',
    VERSION: '1.0',
    AUTH_SCHEME: {
        scheme: 'bearer',
        bearerFormat: 'JWT',
        type: 'http'
    },
    ACCESS_TOKEN: 'AccessToken'
}

export const SUPPORTED_LANGUAGES = {
    EN: 'en',
    HI: 'hi',
};

export enum Timezone {
    AsiaKolkata = 'Asia/kolkata'
}

export enum DeviceType {
    Android = '1',
    Ios = '2',
    Web = '3'
}


export const COMMON_HEADERS: ApiHeaderOptions[] = [
    {
        name: 'Accept-Language',
        enum: SUPPORTED_LANGUAGES,
        example: SUPPORTED_LANGUAGES.EN,
        required: false,

    },
    {
        name: 'Device-Type',
        enum: DeviceType,
        example: DeviceType.Web,
        required: false,

    },
    {
        name: 'Timezone',
        enum: Timezone,
        example: Timezone.AsiaKolkata,
        required: true,

    }
]
