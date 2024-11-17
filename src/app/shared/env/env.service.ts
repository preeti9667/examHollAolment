import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EnvConfig } from "src/config";

@Injectable()
export class EnvService {
    readonly PORT = this.get('PORT');
    readonly BYPASS_OTP = this.get('BYPASS_OTP');
    readonly SECRETS_AUTH_TOKEN = this.get('SECRETS_AUTH_TOKEN');
    readonly SECRETS_REFRESH_TOKEN = this.get('SECRETS_REFRESH_TOKEN');
    readonly SECRETS_PASSWORD_TOKEN = this.get('SECRETS_PASSWORD_TOKEN');
    readonly SECRETS_PRIVATE_KEY = this.get('SECRETS_PRIVATE_KEY');
    readonly SECRETS_PUBLIC_KEY = this.get('SECRETS_PUBLIC_KEY');

    readonly REDIS_HOST = this.get('REDIS_HOST');
    readonly REDIS_PORT = this.get('REDIS_PORT');
    readonly REDIS_PASSWORD = this.get('REDIS_PASSWORD');
    readonly REDIS_DB = this.get('REDIS_DB');

    readonly SABPAISA_CLIENT_CODE = this.get('SABPAISA_CLIENT_CODE');
    readonly SABPAISA_TRANS_USER_NAME = this.get('SABPAISA_TRANS_USER_NAME');
    readonly SABPAISA_TRANS_USER_PASSWORD = this.get('SABPAISA_TRANS_USER_PASSWORD');
    readonly SABPAISA_AUTH_IV = this.get('SABPAISA_AUTH_IV');
    readonly SABPAISA_AUTH_KEY = this.get('SABPAISA_AUTH_KEY');
    readonly SABPAISA_MCC = this.get('SABPAISA_MCC');
    readonly SABPAISA_URL = this.get('SABPAISA_URL');
    readonly SUBPAISA_CALLBACK_URL = this.get('SUBPAISA_CALLBACK_URL');
    readonly REDIRECT_URL_PAYMENT = this.get('REDIRECT_URL_PAYMENT');


    readonly MSD_USERNAME = this.get('MSD_USERNAME');
    readonly MSD_PASSWORD = this.get('MSD_PASSWORD');
    readonly MSD_SENDER_ID = this.get('MSD_SENDER_ID');
    readonly MSD_SECURE_KEY = this.get('MSD_SECURE_KEY');

    // readonly ADMIN = this.get('ADMIN');
    // readonly MONGO = this.get('MONGO');
    // readonly REDIS = this.get('REDIS');
    // readonly KAFKA = this.get('KAFKA');
    // readonly GRPC = this.get('GRPC');
    // readonly SECRETS = this.get('SECRETS');
    // readonly AEROSPIKE = this.get('AEROSPIKE');
    // readonly NODE_ENV = this.get('NODE_ENV');
    // readonly S3 = this.get('S3');
    // readonly SCHEDULER = this.get('SCHEDULER');
    constructor(private config: ConfigService<EnvConfig, true>) { }
    get<Key extends keyof EnvConfig>(key: Key): EnvConfig[Key] {
        return this.config.get(key);
    }
}