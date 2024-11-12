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

    readonly ADMIN_NAME = this.get('ADMIN_NAME');
    readonly ADMIN_EMAIL = this.get('ADMIN_EMAIL');
    readonly ADMIN_PHONE_NUMBER = this.get('ADMIN_PHONE_NUMBER');
    readonly ADMIN_COUNTRY_CODE = this.get('ADMIN_COUNTRY_CODE');
    readonly ADMIN_PASSWORD = this.get('ADMIN_PASSWORD');

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